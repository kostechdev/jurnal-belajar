<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laporan Absensi</title>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 12px;
            color: #333;
        }
        .header-container {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
            overflow: auto; /* To contain floated elements */
        }
        .logo {
            float: left;
            width: 90px; /* Adjust as needed */
            height: 90px; /* Adjust as needed */
            margin-right: 20px;
        }
        .logo-right {
            float: right;
            width: 90px; /* Adjust as needed */
            height: 90px; /* Adjust as needed */
            margin-left: 20px;
        }
        .header-text {
            overflow: hidden; /* To take up remaining space */
            text-align: center;
        }
        .header-text h1, .header-text h2, .header-text p {
            margin: 0;
            padding: 2px 0;
        }
        .header-text h1 {
            font-size: 18px;
            font-weight: bold;
        }
        .header-text h2 {
            font-size: 16px;
        }
        .header-text p {
            font-size: 10px;
        }
        .report-title {
            text-align: center;
            font-size: 16px;
            font-weight: bold;
            margin-top: 30px;
            margin-bottom: 20px;
            text-transform: uppercase;
        }
        .info-table {
            width: 100%;
            margin-bottom: 20px;
            font-size: 12px;
        }
        .info-table td {
            padding: 2px 5px;
        }
        .main-table {
            width: 100%;
            border-collapse: collapse;
        }
        .main-table th, .main-table td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
        }
        .main-table th {
            background-color: #f2f2f2;
            text-align: center;
        }
        .main-table td.center {
            text-align: center;
        }
        .hadir { color: green; font-weight: bold; }
        .sakit { color: #DAA520; font-weight: bold; } /* DarkGoldenRod */
        .izin { color: blue; font-weight: bold; }
        .alpa { color: red; font-weight: bold; }
        .footer {
            margin-top: 40px;
            width: 100%;
            font-size: 12px;
        }
        .signature {
            float: right;
            width: 300px;
            text-align: center;
        }
        .signature p {
            margin-bottom: 60px;
        }
    </style>
</head>
<body>
    @php
        // Function to embed image as base64
        function image_to_base64($path) {
            $type = pathinfo($path, PATHINFO_EXTENSION);
            $data = file_get_contents($path);
            return 'data:image/' . $type . ';base64,' . base64_encode($data);
        }
        $logoPath = public_path('images/logo/logo.jpeg');
        $logoBase64 = file_exists($logoPath) ? image_to_base64($logoPath) : '';

        $logoKananPath = public_path('images/logo/kanan.png');
        $logoKananBase64 = file_exists($logoKananPath) ? image_to_base64($logoKananPath) : '';
    @endphp

    <div class="header-container">
        @if($logoBase64)
            <img src="{{ $logoBase64 }}" alt="Logo Kiri" class="logo">
        @endif
        @if($logoKananBase64)
            <img src="{{ $logoKananBase64 }}" alt="Logo Kanan" class="logo-right">
        @endif
        <div class="header-text">
            <h1>PEMERINTAH PROVINSI BANTEN</h1>
            <h2>DINAS PENDIDIKAN DAN KEBUDAYAAN</h2>
            <h1 style="font-size: 20px;">SMK NEGERI 4 CILEGON</h1>
            <p>Jl. Yos Sudarso Link Baru II, Lb. Gede, Kec. Pulomerak, Kota Cilegon, Banten 42439</p>
        </div>
    </div>

    <div class="report-title">
        LAPORAN REKAPITULASI KEHADIRAN SISWA
    </div>

    <table class="info-table">
        <tr>
            <td width="120px">Kelas</td>
            <td>: {{ $nama_kelas }}</td>
            <td width="120px">Bulan</td>
            <td>: {{ $bulan }}</td>
        </tr>
        <tr>
            <td>Wali Kelas</td>
            <td>: {{ $wali_kelas }}</td>
            <td>Tahun Ajaran</td>
            <td>: {{ $tahun_ajaran }}</td>
        </tr>
    </table>

    <table class="main-table">
        <thead>
            <tr>
                <th width="5%">No</th>
                <th width="25%">Nama Siswa</th>
                <th width="15%">NIS</th>
                <th width="10%">Hadir</th>
                <th width="10%">Sakit</th>
                <th width="10%">Izin</th>
                <th width="10%">Alpa</th>
                <th width="15%">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($rekapSiswa as $index => $siswa)
                <tr>
                    <td class="center">{{ $index + 1 }}</td>
                    <td>{{ $siswa['nama_lengkap'] }}</td>
                    <td class="center">{{ $siswa['nis'] }}</td>
                    <td class="center hadir">{{ $siswa['hadir'] }}</td>
                    <td class="center sakit">{{ $siswa['sakit'] }}</td>
                    <td class="center izin">{{ $siswa['izin'] }}</td>
                    <td class="center alpa">{{ $siswa['alpa'] }}</td>
                    <td class="center">{{ $siswa['hadir'] + $siswa['sakit'] + $siswa['izin'] + $siswa['alpa'] }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer" style="overflow: auto; width: 100%;">
        <div style="width: 45%; float: left; text-align: center;">
            <p>Wali Kelas,</p>
            <p style="margin-top: 70px;"><strong>{{ $wali_kelas }}</strong></p>
        </div>
        <div style="width: 45%; float: right; text-align: center;">
            <p>Cilegon, {{ \Carbon\Carbon::now()->translatedFormat('d F Y') }}</p>
            <p>Kepala Sekolah,</p>
            <p style="margin-top: 60px;"><strong>Amanatul Khaeroh, S.Si., M.Pd</strong></p>
            <p>NIP. 19810601 201001 2 010</p>
        </div>
    </div>

</body>
</html>
