<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    {{-- <link rel="icon" type="image/x-icon" href="/img/favicon.ico"> --}}
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Inventory App</title>
    {{-- react --}}
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">

    <meta name="title" content="Inventory App" />
    <meta name="description" content="Sistem Inventory untuk peminjaman barang." />


    <meta property="og:type" content="website" />
    {{-- <meta property="og:url" content="https://sim.smkn1kasreman.sch.id//" /> --}}
    <meta property="og:title" content="Inventory App" />
    <meta property="og:description" content="Sistem Inventory untuk peminjaman barang" />
    {{-- <meta property="og:image" content="https://sim.smkn1kasreman.sch.id/img/logo_skanka.png" /> --}}

    <meta property="twitter:card" content="summary_large_image" />
    {{-- <meta property="twitter:url" content="https://sim.smkn1kasreman.sch.id//" /> --}}
    <meta property="twitter:title" content="Inventory App" />
     <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta property="twitter:description" content="Sistem Inventory untuk peminjaman barang" />
    {{-- <meta property="twitter:image" content="https://sim.smkn1kasreman.sch.id/img/logo_skanka.png" /> --}}
    <link rel="manifest" href="/manifest.webmanifest">
<meta name="theme-color" content="#ffffff">
    @viteReactRefresh
    @vite('resources/js/app.jsx')
    @vite('resources/css/app.css')
    @inertiaHead
</head>

<body>
    @inertia
</body>

</html>
