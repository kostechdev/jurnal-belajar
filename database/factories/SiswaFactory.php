<?php

namespace Database\Factories;

use App\Models\Kelas;
use App\Models\Siswa;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Siswa>
 */
class SiswaFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Siswa::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $kelasIds = Kelas::pluck('kelas_id')->toArray();

        return [
            'NIS' => $this->faker->unique()->numerify('10######'),
            'NISN' => $this->faker->unique()->numerify('00########'),
            'nama_lengkap' => $this->faker->name(),
            'tempat_lahir' => $this->faker->city(),
            'tanggal_lahir' => $this->faker->date(),
            'jenis_kelamin' => $this->faker->randomElement(['Laki-laki', 'Perempuan']),
            'alamat' => $this->faker->address(),
            'nomor_telepon_siswa' => $this->faker->phoneNumber(),
            'nama_wali_murid' => $this->faker->name(),
            'nomor_telepon_wali_murid' => $this->faker->phoneNumber(),
            'kelas_id' => $this->faker->randomElement($kelasIds),
            'status_siswa' => 'Aktif',
        ];
    }
}
