"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
	ESTADO_FAMILIA_META,
	integrantesDe,
	asistenDe,
	responsablesDe,
	estadoFamilia,
	toCsvFamilias,
	fetchBdInterno,
	guardarAsistenciaRemota,
	copiarTexto,
	mensajeInvitacion,
	uid,
	hoyPartes,
	type Familia,
	type Integrante,
	type LogEvento,
	type EstadoFamilia,
} from "@/data/boda";
import { debeSustituirConBd, loadLocalBd, mensajeDeCarga } from "./bd-init";

type TipoFiltro = "todas" | "familia" | "individual";
type EstadoFiltro = EstadoFamilia | "todas";

const STORAGE_KEY = "boda-bd-v2";

function Icon({ d, label }: { d: string; label: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			width="18"
			height="18"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.8}
			strokeLinecap="round"
			strokeLinejoin="round"
			role="img"
			aria-label={label}
		>
			<path d={d} />
		</svg>
	);
}

const P = {
	buscar:
		"M11 4a7 7 0 1 0 4.9 12L20 20l1-1-4-4A7 7 0 0 0 11 4Zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z",
	tel: "M6.5 3.5h3l1.5 4.5-2 1.5a12 12 0 0 0 5 5l1.5-2 4.5 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z",
	x: "M6 6l12 12M18 6L6 18",
	descarga: "M12 4v11m0 0 4-4m-4 4-4-4M5 20h14",
	copia: "M9 9h10v11H9zM5 15V4h10",
	flecha: "M9 6l6 6-6 6",
	enlace:
		"M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1m-4 4a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1",
};

function SelloFamilia({ estado }: { estado: EstadoFamilia }) {
	const meta = ESTADO_FAMILIA_META[estado];
	return (
		<span
			aria-hidden="true"
			title={meta.etiqueta}
			className="seal flex h-9 w-9 shrink-0 items-center justify-center text-sm font-extrabold"
			style={{
				background: meta.fondo,
				color: meta.tinta,
				borderRadius: 2,
				letterSpacing: "0.04em",
			}}
		>
			{meta.sello}
		</span>
	);
}

export default function PanelBoda() {
	// Estado inicial vacío y determinista: el primer render debe ser idéntico
	// en servidor y cliente para no romper la hidratación. Solo se muestran
	// datos traídos del spreadsheet (caché local o /api/bd en el montaje).
	const [familias, setFamilias] = useState<Familia[]>([]);
	const [integrantes, setIntegrantes] = useState<Integrante[]>([]);
	const [logs, setLogs] = useState<LogEvento[]>([]);
	const [busqueda, setBusqueda] = useState("");
	const [tipoFiltro, setTipoFiltro] = useState<TipoFiltro>("todas");
	const [estadoFiltro, setEstadoFiltro] = useState<EstadoFiltro>("todas");
	const [respFiltro, setRespFiltro] = useState<string>("todos");
	const [seleccionada, setSeleccionada] = useState<string | null>(null);
	const [cargando, setCargando] = useState(true);
	const [aviso, setAviso] = useState<string | null>(null);
	const [errorCarga, setErrorCarga] = useState<string | null>(null);
	const [intentoCarga, setIntentoCarga] = useState(0);

	useEffect(() => {
		// No sobrescribir la caché con el estado inicial vacío durante la carga.
		if (cargando) return;
		try {
			window.localStorage.setItem(
				STORAGE_KEY,
				JSON.stringify({ familias, integrantes, logs }),
			);
		} catch {
			/* sin almacenamiento */
		}
	}, [familias, integrantes, logs, cargando]);

	function mostrarAviso(texto: string) {
		setAviso(texto);
		window.setTimeout(() => setAviso(null), 2600);
	}

	// Hidratación + carga del Sheet al abrir (solo cliente): primero la
	// caché local si existe, luego los datos reales si traen familias.
	// Se repite al pulsar Reintentar (intentoCarga).
	useEffect(() => {
		let cancelado = false;
		void (async () => {
			const cached = loadLocalBd(STORAGE_KEY);
			if (!cancelado && cached) {
				setFamilias(cached.familias);
				setIntegrantes(cached.integrantes);
				setLogs(cached.logs);
			}
			try {
				const bd = await fetchBdInterno();
				if (cancelado) return;
				if (debeSustituirConBd(bd)) {
					setFamilias(bd.familias);
					setIntegrantes(bd.integrantes);
					setLogs(bd.log);
					setErrorCarga(null);
				} else {
					setErrorCarga("El Sheet no devolvió familias.");
				}
			} catch (e) {
				if (cancelado) return;
				setErrorCarga(mensajeDeCarga(e));
			} finally {
				if (!cancelado) setCargando(false);
			}
		})();
		return () => {
			cancelado = true;
		};
	}, [intentoCarga]);

	function reintentarCarga() {
		setErrorCarga(null);
		setCargando(true);
		setIntentoCarga((n) => n + 1);
	}

	const telefonosResponsables = useMemo(() => {
		const set = new Set<string>();
		for (const i of integrantes)
			if (i.responsable.trim()) set.add(i.responsable.trim());
		return [...set].sort();
	}, [integrantes]);

	const totales = useMemo(() => {
		const totalFam = familias.length;
		const totalPers = integrantes.length;
		const asisten = integrantes.filter((i) => i.asistencia).length;
		const cupo = familias.reduce((s, f) => s + f.num_invitados, 0);
		const sinResp = integrantes.filter((i) => !i.responsable.trim()).length;
		return {
			totalFam,
			totalPers,
			asisten,
			cupo,
			sinResp,
			ocupacion: cupo === 0 ? 0 : asisten / cupo,
		};
	}, [familias, integrantes]);

	const familiasVisibles = useMemo(() => {
		const q = busqueda.trim().toLowerCase();
		return familias
			.filter((f) => {
				if (tipoFiltro === "familia" && !f.is_family) return false;
				if (tipoFiltro === "individual" && f.is_family) return false;
				if (
					estadoFiltro !== "todas" &&
					estadoFamilia(f, integrantes) !== estadoFiltro
				)
					return false;
				if (
					respFiltro !== "todos" &&
					!responsablesDe(integrantes, f.id_familia).includes(respFiltro)
				)
					return false;
				if (!q) return true;
				const resp = responsablesDe(integrantes, f.id_familia).join(" ");
				const miem = integrantesDe(integrantes, f.id_familia)
					.map((i) => i.nombre)
					.join(" ");
				return `${f.nombre} ${f.id_familia} ${resp} ${miem} ${f.num_invitados}`
					.toLowerCase()
					.includes(q);
			})
			.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
	}, [familias, integrantes, busqueda, tipoFiltro, estadoFiltro, respFiltro]);

	const famSel = seleccionada
		? (familias.find((f) => f.id_familia === seleccionada) ?? null)
		: null;

	function pushLog(idFamilia: string, familiaNombre: string, evento: string) {
		const { hora, fecha } = hoyPartes();
		setLogs((prev) => [
			...prev,
			{
				id_evento: uid("log"),
				id_familia: idFamilia,
				familia: familiaNombre,
				evento,
				hora,
				fecha,
			},
		]);
	}

	function toggleAsistencia(idFamilia: string, nombre: string) {
		const actual =
			integrantes.find((i) => i.id === idFamilia && i.nombre === nombre)
				?.asistencia ?? false;
		const fam = familias.find((f) => f.id_familia === idFamilia);
		setIntegrantes((prev) =>
			prev.map((i) =>
				i.id === idFamilia && i.nombre === nombre
					? { ...i, asistencia: !i.asistencia }
					: i,
			),
		);
		if (fam)
			pushLog(fam.id_familia, fam.nombre, `Cambió asistencia de ${nombre}`);
		if (fam) {
			void guardarAsistenciaRemota(
				idFamilia,
				nombre,
				!actual,
				fam.nombre,
			).catch(() =>
				mostrarAviso("Guardado local; no se pudo escribir en el Sheet."),
			);
		}
	}

	function exportar() {
		const blob = new Blob([toCsvFamilias(familiasVisibles)], {
			type: "text/csv;charset=utf-8",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "familias.csv";
		a.click();
		URL.revokeObjectURL(url);
		mostrarAviso("CSV descargado.");
	}

	function copiarLinks() {
		const lineas = familiasVisibles.map((f) => `${f.nombre} — ${f.link}`);
		if (lineas.length === 0) {
			mostrarAviso("Nada que copiar.");
			return;
		}
		void copiarTexto(lineas.join("\n")).then((ok) =>
			mostrarAviso(ok ? `${lineas.length} links copiados.` : "No se pudo copiar."),
		);
	}

	return (
		<div className="flex min-h-screen">
			<a
				href="#lista"
				className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2"
			>
				Saltar a la lista
			</a>

			<aside
				className="hidden w-[272px] shrink-0 flex-col self-start lg:flex lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto"
				style={{ background: "var(--color-brand-deep)", color: "#fff" }}
				aria-label="Navegación del panel"
			>
				<div className="flex flex-col gap-6 p-6">
					<div>
						<Image
							src="/logo-boda-blanco.png"
							alt="Monograma N+E — Boda"
							width={120}
							height={67}
							priority
							className="mb-4 h-auto w-[120px]"
						/>
						<p className="text-sm font-semibold uppercase tracking-[0.18em] opacity-80">
							Boda · Panel
						</p>
						<h1 className="mt-1 text-3xl font-extrabold leading-tight tracking-tight">
							Invitados
						</h1>
					</div>

					<div className="rounded-md bg-white/10 p-4">
						<div className="flex items-baseline justify-between">
							<p className="text-sm font-semibold">Ocupación</p>
							<p
								className="text-2xl font-extrabold"
								aria-live="polite"
								key={totales.asisten}
							>
								<span className="flap">
									{Math.round(totales.ocupacion * 100)}%
								</span>
							</p>
						</div>
						<div
							className="mt-2 h-2 overflow-hidden rounded-full bg-white/20"
							role="progressbar"
							aria-valuenow={Math.round(totales.ocupacion * 100)}
							aria-valuemin={0}
							aria-valuemax={100}
							aria-label="Ocupación confirmada sobre cupo"
						>
							<div
								className="h-full rounded-full bg-white"
								style={{ width: `${Math.round(totales.ocupacion * 100)}%` }}
							/>
						</div>
						<p className="mt-2 text-xs leading-5 opacity-85">
							{totales.asisten} de {totales.cupo} plazas.
						</p>
					</div>

					<div className="rounded-md border border-white/25 p-4 text-sm leading-6">
						<p className="font-bold">Planner</p>
						<p className="opacity-85">
							{totales.sinResp} integrantes sin responsable ·{" "}
							{telefonosResponsables.length} responsables con teléfono
						</p>
						<button
							type="button"
							onClick={copiarLinks}
							className="pressable mt-3 inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-[13px] font-bold text-[var(--color-brand-deep)]"
						>
							<Icon d={P.copia} label="Copiar" />
							Copiar links
						</button>
					</div>
				</div>
			</aside>

			<main className="min-w-0 flex-1">
				<div
					className="flex items-center justify-between gap-3 px-4 lg:hidden"
					style={{
						color: "var(--color-brand-deep)",
						paddingTop: "max(1rem, env(safe-area-inset-top))",
					}}
				>
					<div className="flex items-center gap-3">
						<span
							className="inline-flex items-center rounded-md px-2 py-1"
							style={{ background: "var(--color-brand-deep)" }}
						>
							<Image
								src="/logo-boda-blanco.png"
								alt="Monograma N+E — Boda"
								width={64}
								height={36}
								priority
								className="h-auto w-[64px]"
							/>
						</span>
						<p className="text-lg font-extrabold tracking-tight">
							Boda · Invitados
						</p>
					</div>
				</div>

				<div
					className="sticky top-0 z-20 px-4 pb-2 lg:px-8"
					style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
				>
					<div className="tile rounded-lg p-3 sm:p-4">
						<div className="flex flex-col gap-3">
							<div className="flex flex-col gap-3 md:flex-row md:items-center">
								<label className="relative block flex-1">
									<span className="sr-only">Buscar</span>
									<span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-60">
										<Icon d={P.buscar} label="Buscar" />
									</span>
									<input
										value={busqueda}
										onChange={(e) => setBusqueda(e.target.value)}
										placeholder="Buscar familia, integrante, teléfono, ID…"
										inputMode="search"
										autoComplete="off"
										className="min-h-[44px] w-full rounded-md border border-[var(--color-brand-border)] bg-white py-2.5 pl-10 pr-3 text-base placeholder:text-[var(--color-brand-muted)]"
									/>
								</label>
								<div className="hidden items-center gap-2 md:flex">
									<select
										value={tipoFiltro}
										onChange={(e) =>
											setTipoFiltro(e.target.value as TipoFiltro)
										}
										className="min-h-[44px] rounded-md border border-[var(--color-brand-border)] bg-white px-3 py-2.5 text-sm font-semibold"
										aria-label="Filtrar por tipo"
									>
										<option value="todas">Todas (F + individuales)</option>
										<option value="familia">Solo familias</option>
										<option value="individual">Solo individuales</option>
									</select>
									<select
										value={respFiltro}
										onChange={(e) => setRespFiltro(e.target.value)}
										className="min-h-[44px] rounded-md border border-[var(--color-brand-border)] bg-white px-3 py-2.5 text-sm font-semibold"
										aria-label="Filtrar por responsable"
									>
										<option value="todos">Todos los responsables</option>
										{telefonosResponsables.map((t) => (
											<option key={t} value={t}>
												{t}
											</option>
										))}
									</select>
								</div>
							</div>

							<div
								className="chips-scroll -mx-1 flex flex-nowrap items-center gap-2 overflow-x-auto px-1 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:pb-0"
								role="group"
								aria-label="Filtrar por estado de familia"
							>
								{(
									[
										"todas",
										"sin_registro",
										"pendiente",
										"parcial",
										"completa",
									] as EstadoFiltro[]
								).map((e) => {
									const activo = estadoFiltro === e;
									const etiqueta =
										e === "todas" ? "Todas" : ESTADO_FAMILIA_META[e].etiqueta;
									const n =
										e === "todas"
											? familias.length
											: familias.filter(
													(f) => estadoFamilia(f, integrantes) === e,
												).length;
									return (
										<button
											key={e}
											type="button"
											onClick={() => setEstadoFiltro(e)}
											aria-pressed={activo}
											className="pressable inline-flex min-h-[44px] shrink-0 snap-start items-center gap-2 rounded-md border px-3 py-2 text-sm font-bold"
											style={
												activo
													? {
															background: "var(--color-brand-dark)",
															borderColor: "var(--color-brand-dark)",
															color: "#fff",
														}
													: {
															background: "#fff",
															borderColor: "var(--color-brand-border)",
															color: "var(--color-brand-text)",
														}
											}
										>
											{etiqueta}
											<span
												className="rounded-full px-2 py-0.5 text-xs font-extrabold"
												style={
													activo
														? { background: "rgb(255 255 255 / 0.22)" }
														: {
																background: "var(--color-brand-soft)",
																color: "var(--color-brand-text)",
															}
												}
												key={n}
											>
												<span className="flap">{n}</span>
											</span>
										</button>
									);
								})}
							</div>

							<details className="rounded-md border border-[var(--color-brand-border)] bg-white md:hidden">
								<summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-2 px-3 py-2 text-sm font-bold">
									Filtros y acciones
									<span
										aria-hidden="true"
										className="rounded-full bg-[var(--color-brand-soft)] px-2 py-0.5 text-xs font-extrabold"
									>
										{familiasVisibles.length}
									</span>
								</summary>
								<div className="flex flex-col gap-2 border-t border-[var(--color-brand-border)] p-3">
									<select
										value={tipoFiltro}
										onChange={(e) =>
											setTipoFiltro(e.target.value as TipoFiltro)
										}
										className="min-h-[44px] w-full rounded-md border border-[var(--color-brand-border)] bg-white px-3 py-2.5 text-base font-semibold"
										aria-label="Filtrar por tipo"
									>
										<option value="todas">Todas (F + individuales)</option>
										<option value="familia">Solo familias</option>
										<option value="individual">Solo individuales</option>
									</select>
									<select
										value={respFiltro}
										onChange={(e) => setRespFiltro(e.target.value)}
										className="min-h-[44px] w-full rounded-md border border-[var(--color-brand-border)] bg-white px-3 py-2.5 text-base font-semibold"
										aria-label="Filtrar por responsable"
									>
										<option value="todos">Todos los responsables</option>
										{telefonosResponsables.map((t) => (
											<option key={t} value={t}>
												{t}
											</option>
										))}
									</select>
									<button
										type="button"
										onClick={exportar}
										className="pressable inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md border border-[var(--color-brand-border)] bg-white px-3 py-2 text-sm font-bold"
									>
										<Icon d={P.descarga} label="Descargar" /> Exportar CSV
									</button>
								</div>
							</details>

							<div className="hidden flex-wrap items-center gap-2 border-t border-[var(--color-brand-border)] pt-3 md:flex">
								<button
									type="button"
									onClick={exportar}
									className="pressable inline-flex min-h-[44px] items-center gap-2 rounded-md border border-[var(--color-brand-border)] bg-white px-3 py-2 text-sm font-bold"
								>
									<Icon d={P.descarga} label="Descargar" /> Exportar CSV
								</button>
							</div>
						</div>
					</div>
				</div>

				<div
					className="px-4 lg:px-8"
					style={{ paddingBottom: "max(4rem, env(safe-area-inset-bottom))" }}
				>
					{errorCarga && (
						<div
							role="alert"
							className="tile mt-4 rounded-lg border p-4"
							style={{
								borderColor: "rgb(158 79 79 / 0.4)",
								background: "var(--color-clay-bg)",
							}}
						>
							<p
								className="font-bold"
								style={{ color: "var(--color-clay-ink)" }}
							>
								No se pudo cargar el Sheet
							</p>
							<p className="mt-1 text-sm font-semibold text-[var(--color-brand-text)]">
								{errorCarga}
							</p>
							<button
								type="button"
								onClick={reintentarCarga}
								disabled={cargando}
								className="pressable mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-md px-3 py-2 text-sm font-bold text-white disabled:opacity-50"
								style={{ background: "var(--color-brand-dark)" }}
							>
								{cargando ? "Cargando…" : "Reintentar"}
							</button>
						</div>
					)}
					{cargando && !errorCarga && familias.length === 0 && (
						<p
							role="status"
							className="mt-4 text-sm font-semibold text-[var(--color-brand-muted)]"
						>
							Cargando datos del Sheet…
						</p>
					)}
					<h2 className="mb-2 mt-8 text-xl font-extrabold tracking-tight">
						Situación
					</h2>
					<section
						aria-label="Resumen"
						className="grid grid-cols-2 gap-3 xl:grid-cols-3"
					>
						<div className="tile order-2 rounded-lg p-4 xl:order-none">
							<p className="text-[13px] font-bold uppercase tracking-[0.14em] text-[var(--color-brand-muted)]">
								Familias
							</p>
							<p
								className="mt-1 text-[2rem] font-extrabold tracking-tight sm:text-4xl"
								aria-live="polite"
								key={totales.totalFam}
							>
								<span className="flap">{totales.totalFam}</span>
							</p>
							<p className="mt-2 text-[13px] font-semibold leading-5 text-[var(--color-brand-muted)]">
								{familias.filter((f) => f.is_family).length} familias ·{" "}
								{familias.filter((f) => !f.is_family).length} individuales
							</p>
						</div>
						<div
							className="tile order-1 col-span-2 rounded-lg p-4 xl:order-none xl:col-span-1"
							style={{
								background: "var(--color-brand-deep)",
								borderColor: "var(--color-brand-deep)",
								color: "#fff",
							}}
						>
							<p className="text-[13px] font-bold uppercase tracking-[0.14em] opacity-80">
								Asistirán
							</p>
							<p
								className="mt-1 text-[2rem] font-extrabold tracking-tight sm:text-4xl"
								aria-live="polite"
								key={totales.asisten}
							>
								<span className="flap">{totales.asisten}</span>
							</p>
							<p className="mt-2 text-[13px] font-semibold opacity-85">
								{totales.totalPers} integrantes registrados
							</p>
						</div>
						<div className="tile order-3 rounded-lg p-4 xl:order-none">
							<p className="text-[13px] font-bold uppercase tracking-[0.14em] text-[var(--color-brand-muted)]">
								Cupo total
							</p>
							<p
								className="mt-1 text-[2rem] font-extrabold tracking-tight sm:text-4xl"
								style={{ color: "var(--color-sand-ink)" }}
								aria-live="polite"
								key={totales.cupo}
							>
								<span className="flap">{totales.cupo}</span>
							</p>
							<p className="mt-2 text-[13px] font-semibold leading-5 text-[var(--color-brand-muted)]">
								{totales.asisten} asisten · {totales.cupo} plazas
							</p>
						</div>
					</section>

					<div className="mb-2 mt-10 flex flex-wrap items-end justify-between gap-2">
						<h2 id="lista" className="text-xl font-extrabold tracking-tight">
							Familias
						</h2>
						<p className="text-sm font-semibold text-[var(--color-brand-muted)]">
							{`${familiasVisibles.length} de ${familias.length}`} registros
						</p>
					</div>

					<section
						aria-label="Familias"
						className="tile overflow-hidden rounded-lg"
					>
						<div className="hidden overflow-x-auto md:block">
							<table className="w-full min-w-[920px] border-collapse bg-white text-left text-[14px]">
								<thead>
									<tr className="border-b border-[var(--color-brand-border)] text-[12px] uppercase tracking-[0.12em] text-[var(--color-brand-muted)]">
										<th scope="col" className="px-4 py-3 font-bold">
											Familia
										</th>
										<th scope="col" className="px-4 py-3 font-bold">
											Cupo
										</th>
										<th scope="col" className="px-4 py-3 font-bold">
											Integrantes
										</th>
										<th scope="col" className="px-4 py-3 font-bold">
											Estado
										</th>
										<th scope="col" className="px-4 py-3 font-bold">
											Teléfono
										</th>
										<th scope="col" className="px-4 py-3 font-bold">
											Link
										</th>
										<th scope="col" className="px-4 py-3 font-bold">
											<span className="sr-only">Acciones</span>
										</th>
									</tr>
								</thead>
								<tbody>
									{familiasVisibles.map((f) => {
										const lista = integrantesDe(integrantes, f.id_familia);
										const ok = asistenDe(integrantes, f.id_familia);
										const estado = estadoFamilia(f, integrantes);
										const meta = ESTADO_FAMILIA_META[estado];
										const resp = responsablesDe(integrantes, f.id_familia);
										const abierto = seleccionada === f.id_familia;
										return (
											<tr
												key={f.id_familia}
												className={`border-b border-[var(--color-brand-soft)] last:border-0 hover:bg-[var(--color-brand-bg)] ${abierto ? "bg-[var(--color-brand-bg)]" : ""}`}
											>
												<td className="px-4 py-3">
													<div className="flex items-center gap-3">
														<SelloFamilia estado={estado} />
														<div className="min-w-0">
															<p className="font-bold leading-5">
																<span className="truncate capitalize">
																	{f.nombre}
																</span>
															</p>
															<p
																className="mt-0.5 max-w-[260px] truncate text-[13px] font-medium text-[var(--color-brand-muted)]"
																title={f.id_familia}
															>
																{f.id_familia.slice(0, 12)}… ·{" "}
																{f.is_family ? "Familia" : "Individual"}
															</p>
														</div>
													</div>
												</td>
												<td className="px-4 py-3 font-extrabold">
													{f.num_invitados}
												</td>
												<td className="px-4 py-3">
													<span className="font-extrabold">
														{lista.length}/{f.num_invitados}
													</span>
													<span
														className="mt-1 flex h-2 w-24 items-center gap-[3px]"
														aria-hidden="true"
													>
														{Array.from({
															length: Math.max(f.num_invitados, 1),
														}).map((_, i) => (
															<span
																key={i}
																className="block h-2 flex-1 rounded-full"
																style={{
																	background:
																		i < lista.length
																			? "var(--color-brand-dark)"
																			: "var(--color-brand-border)",
																}}
															/>
														))}
													</span>
													<p className="mt-0.5 text-[12px] font-semibold text-[var(--color-brand-muted)]">
														{ok} asisten
													</p>
												</td>
												<td className="px-4 py-3">
													<span
														className="inline-block rounded-md border px-2 py-1 text-[12px] font-extrabold uppercase tracking-[0.08em]"
														style={{
															background: meta.fondo,
															color: meta.tinta,
															borderColor: meta.borde,
														}}
													>
														{meta.etiqueta}
													</span>
												</td>
												<td className="px-4 py-3">
													{resp.length === 0 ? (
														<span className="text-[13px] font-bold text-[var(--color-clay-ink)]">
															Sin teléfono
														</span>
													) : (
														resp.map((t) => (
															<p key={t}>
																<a
																	href={`tel:${t.replace(/\s/g, "")}`}
																	className="font-semibold text-[var(--color-brand-dark)] hover:underline"
																>
																	{t}
																</a>
															</p>
														))
													)}
												</td>
												<td className="px-4 py-3">
													<div className="flex items-center gap-1">
														<a
															href={f.link}
															target="_blank"
															rel="noreferrer"
															aria-label={`Abrir invitación de ${f.nombre}`}
															className="pressable inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md p-2 text-[var(--color-brand-dark)] hover:bg-[var(--color-brand-soft)]"
														>
															<Icon d={P.enlace} label="Abrir" />
														</a>
														<button
															type="button"
															onClick={() => {
																void copiarTexto(f.link).then((ok) =>
																	mostrarAviso(ok ? "Link copiado." : "No se pudo copiar."),
																);
															}}
															aria-label={`Copiar link de ${f.nombre}`}
															className="pressable inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md p-2 hover:bg-[var(--color-brand-soft)]"
															style={{ color: "var(--color-brand-muted)" }}
														>
															<Icon d={P.copia} label="Copiar" />
														</button>
													</div>
												</td>
												<td className="px-4 py-3 text-right">
													<button
														type="button"
														onClick={() =>
															setSeleccionada(abierto ? null : f.id_familia)
														}
														aria-expanded={abierto}
														aria-label={`Abrir ficha de ${f.nombre}`}
														className="pressable inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md p-2 hover:bg-[var(--color-brand-soft)]"
														style={{ color: "var(--color-brand-dark)" }}
													>
														<Icon
															d={abierto ? P.x : P.flecha}
															label="Abrir ficha"
														/>
													</button>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
						<div className="flex flex-col gap-3 bg-[var(--color-brand-bg)] p-3 md:hidden">
							{familiasVisibles.map((f) => {
								const lista = integrantesDe(integrantes, f.id_familia);
								const ok = asistenDe(integrantes, f.id_familia);
								const estado = estadoFamilia(f, integrantes);
								const meta = ESTADO_FAMILIA_META[estado];
								const resp = responsablesDe(integrantes, f.id_familia);
								const abierto = seleccionada === f.id_familia;
								return (
									<article
										key={f.id_familia}
										aria-label={`Familia ${f.nombre}`}
										className="tile rounded-lg p-4"
									>
										<div className="flex items-start gap-3">
											<span
												aria-hidden="true"
												className="seal flex h-11 w-11 shrink-0 items-center justify-center text-base font-extrabold"
												style={{
													background: meta.fondo,
													color: meta.tinta,
													borderRadius: 2,
												}}
											>
												{meta.sello}
											</span>
											<div className="min-w-0 flex-1">
												<p className="truncate text-base font-bold capitalize leading-6">
													{f.nombre}
												</p>
												<p className="mt-0.5 truncate text-[13px] font-medium text-[var(--color-brand-muted)]">
													{f.id_familia.slice(0, 12)}… ·{" "}
													{f.is_family ? "Familia" : "Individual"} · cupo{" "}
													{f.num_invitados}
												</p>
											</div>
											<span
												className="inline-block shrink-0 rounded-md border px-2 py-1 text-[12px] font-extrabold uppercase tracking-[0.08em]"
												style={{
													background: meta.fondo,
													color: meta.tinta,
													borderColor: meta.borde,
												}}
											>
												{meta.etiqueta}
											</span>
										</div>
										<div className="mt-3 flex items-center gap-3">
											<span
												className="flex h-2 flex-1 items-center gap-[3px]"
												aria-hidden="true"
											>
												{Array.from({
													length: Math.max(f.num_invitados, 1),
												}).map((_, i) => (
													<span
														key={i}
														className="block h-2 flex-1 rounded-full"
														style={{
															background:
																i < lista.length
																	? "var(--color-brand-dark)"
																	: "var(--color-brand-border)",
														}}
													/>
												))}
											</span>
											<p className="shrink-0 text-[13px] font-bold text-[var(--color-brand-muted)]">
												{lista.length}/{f.num_invitados} · {ok} asisten
											</p>
										</div>
										<div className="mt-3 flex flex-col gap-2">
											{resp.length === 0 ? (
												<p className="text-sm font-bold text-[var(--color-clay-ink)]">
													Sin teléfono
												</p>
											) : (
												resp.map((t) => (
													<a
														key={t}
														href={`tel:${t.replace(/\s/g, "")}`}
														className="pressable inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md border border-[var(--color-brand-border)] bg-white px-3 py-2 text-base font-bold text-[var(--color-brand-dark)]"
													>
														<Icon d={P.tel} label="Llamar" />
														{t}
													</a>
												))
											)}
											<div className="flex gap-2">
												<a
													href={f.link}
													target="_blank"
													rel="noreferrer"
													aria-label={`Abrir invitación de ${f.nombre}`}
													className="pressable inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-md border border-[var(--color-brand-border)] bg-white px-3 py-2 text-sm font-bold"
												>
													<Icon d={P.enlace} label="Abrir" /> Invitación
												</a>
												<button
													type="button"
													onClick={() =>
														setSeleccionada(abierto ? null : f.id_familia)
													}
													aria-expanded={abierto}
													aria-label={`Abrir ficha de ${f.nombre}`}
													className="pressable inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-bold text-white"
													style={{ background: "var(--color-brand-dark)" }}
												>
													Ver ficha
												</button>
											</div>
										</div>
									</article>
								);
							})}
							{familiasVisibles.length === 0 && (
								<p className="rounded-md border border-dashed border-[var(--color-brand-border)] bg-white p-4 text-center text-sm font-semibold text-[var(--color-brand-muted)]">
									Sin familias para estos filtros.
								</p>
							)}
						</div>
						<p className="border-t border-[var(--color-brand-border)] bg-[var(--color-brand-bg)] px-4 py-2.5 text-[13px] font-semibold text-[var(--color-brand-muted)]">
							{familiasVisibles.length} familias · {totales.asisten} asisten ·{" "}
							{totales.cupo} plazas
						</p>
					</section>
				</div>
			</main>

			{famSel && (
				<div
					className="fixed inset-0 z-30"
					role="presentation"
					style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
				>
					<button
						type="button"
						aria-label="Cerrar panel"
						onClick={() => setSeleccionada(null)}
						className="absolute inset-0 h-full w-full cursor-default bg-[rgb(58_53_47/0.35)]"
						tabIndex={-1}
					/>
					<aside
						aria-label={`Ficha de ${famSel.nombre}`}
						className="sheet-enter absolute inset-x-0 bottom-0 flex max-h-[92dvh] w-full flex-col overflow-y-auto rounded-t-2xl border-t border-[var(--color-brand-border)] bg-white px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2 shadow-2xl md:inset-x-auto md:bottom-auto md:right-0 md:top-0 md:h-full md:max-h-none md:max-w-[440px] md:rounded-t-none md:border-l md:border-t-0 md:pt-5"
					>
						<div
							aria-hidden="true"
							className="mx-auto mb-2 h-1 w-10 shrink-0 rounded-full bg-[var(--color-brand-border)] md:hidden"
						/>
						<FichaFamilia
							familia={famSel}
							integrantes={integrantesDe(integrantes, famSel.id_familia)}
							logs={logs.filter(
								(l) =>
									(l.id_familia?.trim()
										? l.id_familia === famSel.id_familia
										: false) ||
									l.familia.toLowerCase() === famSel.nombre.toLowerCase(),
							)}
							onCerrar={() => setSeleccionada(null)}
							onToggle={(nombre) => toggleAsistencia(famSel.id_familia, nombre)}
							onAviso={mostrarAviso}
						/>
					</aside>
				</div>
			)}

			{aviso && (
				<p
					role="status"
					className="fixed left-1/2 z-40 -translate-x-1/2 rounded-md px-4 py-2 text-sm font-bold text-white shadow-lg"
					style={{
						background: "var(--color-brand-deep)",
						bottom: "max(1rem, env(safe-area-inset-bottom))",
					}}
				>
					{aviso}
				</p>
			)}
		</div>
	);
}

function FichaFamilia({
	familia,
	integrantes,
	logs,
	onCerrar,
	onToggle,
	onAviso,
}: {
	familia: Familia;
	integrantes: Integrante[];
	logs: LogEvento[];
	onCerrar: () => void;
	onToggle: (nombre: string) => void;
	onAviso?: (texto: string) => void;
}) {
	const estado = ESTADO_FAMILIA_META[estadoFamilia(familia, integrantes)];
	const asisten = integrantes.filter((i) => i.asistencia).length;

	return (
		<div>
			<div className="flex items-start justify-between gap-3">
				<div>
					<h2 className="text-lg font-extrabold tracking-tight">
						{familia.nombre}
					</h2>
					<p
						className="mt-1 text-[13px] font-bold"
						style={{ color: estado.tinta }}
					>
						{estado.etiqueta} · {asisten}/{familia.num_invitados} asisten ·{" "}
						{integrantes.length} registrados
					</p>
				</div>
				<button
					type="button"
					onClick={onCerrar}
					aria-label="Cerrar panel"
					className="pressable inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md p-2 hover:bg-[var(--color-brand-soft)]"
				>
					<Icon d={P.x} label="Cerrar" />
				</button>
			</div>

			<div className="mt-3 flex flex-col gap-2">
				<div className="flex gap-2">
					<a
						href={familia.link}
						target="_blank"
						rel="noreferrer"
						className="pressable inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-bold text-white"
						style={{ background: "var(--color-brand-dark)" }}
					>
						<Icon d={P.enlace} label="Abrir" /> Abrir invitación
					</a>
					<button
						type="button"
						onClick={() => {
							void copiarTexto(familia.link).then((ok) =>
								onAviso?.(ok ? "Link copiado." : "No se pudo copiar."),
							);
						}}
						className="pressable inline-flex min-h-[44px] items-center gap-2 rounded-md border border-[var(--color-brand-border)] bg-white px-3 py-2 text-sm font-bold"
					>
						<Icon d={P.copia} label="Copiar" /> Copiar
					</button>
				</div>
				<button
					type="button"
					onClick={() => {
						void copiarTexto(mensajeInvitacion(familia.link)).then((ok) =>
							onAviso?.(ok ? "Mensaje copiado." : "No se pudo copiar."),
						);
					}}
					aria-label={`Copiar mensaje de invitación para ${familia.nombre}`}
					className="pressable inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-md border border-[var(--color-brand-border)] bg-white px-3 py-2 text-sm font-bold"
					style={{ color: "var(--color-brand-dark)" }}
				>
					<Icon d={P.copia} label="Copiar" /> Copiar mensaje
				</button>
			</div>

			<h3 className="mb-2 mt-5 text-sm font-extrabold uppercase tracking-[0.12em] text-[var(--color-brand-muted)]">
				Integrantes ({integrantes.length})
			</h3>
			<div className="flex flex-col gap-2">
				{integrantes.length === 0 && (
					<p className="rounded-md border border-dashed border-[var(--color-brand-border)] p-3 text-sm text-[var(--color-brand-muted)]">
						Sin filas en INTEGRANTES_FAMILIA para este ID.
					</p>
				)}
				{integrantes.map((g) => (
					<div
						key={g.nombre}
						className="rounded-md border border-[var(--color-brand-border)] bg-white p-3"
					>
						<div className="flex items-center justify-between gap-2">
							<p className="font-bold">{g.nombre}</p>
							<button
								type="button"
								onClick={() => onToggle(g.nombre)}
								aria-pressed={g.asistencia}
								className="pressable inline-flex min-h-[44px] items-center rounded-md border px-3 py-1 text-[12px] font-extrabold uppercase"
								style={
									g.asistencia
										? {
												background: "var(--color-sage-bg)",
												color: "var(--color-sage-ink)",
												borderColor: "rgb(95 112 82 / 0.35)",
											}
										: {
												background: "#fff",
												color: "var(--color-brand-muted)",
												borderColor: "var(--color-brand-border)",
											}
								}
							>
								{g.asistencia ? "TRUE" : "FALSE"}
							</button>
						</div>
						<div className="mt-2">
							<p className="mb-1 text-[12px] font-bold text-[var(--color-brand-muted)]">
								RESPONSABLE
							</p>
							{g.responsable.trim() ? (
								<a
									href={`tel:${g.responsable.replace(/\s/g, "")}`}
									className="inline-flex min-h-[44px] items-center py-1 text-base font-semibold text-[var(--color-brand-dark)] hover:underline"
								>
									{g.responsable}
								</a>
							) : (
								<p className="text-sm font-semibold text-[var(--color-brand-muted)]">
									Sin teléfono
								</p>
							)}
						</div>
					</div>
				))}
			</div>

			<h3 className="mb-2 mt-5 text-sm font-extrabold uppercase tracking-[0.12em] text-[var(--color-brand-muted)]">
				LOG de esta familia
			</h3>
			{logs.length === 0 ? (
				<p className="text-sm text-[var(--color-brand-muted)]">Sin eventos.</p>
			) : (
				logs.map((l) => (
					<p
						key={l.id_evento}
						className="border-b border-[var(--color-brand-soft)] py-1.5 text-[13px] last:border-0"
					>
						<span className="font-bold">
							{l.fecha} {l.hora}
						</span>{" "}
						— {l.evento}
					</p>
				))
			)}
			<button
				type="button"
				onClick={onCerrar}
				className="pressable mt-6 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-md border border-[var(--color-brand-border)] bg-white px-3 py-2 text-sm font-bold"
			>
				Cerrar ficha
			</button>
		</div>
	);
}
