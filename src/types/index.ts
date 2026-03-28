export interface Obat {
    id: string;
    nama: string;
    kategori: string;
    stok: number;
    harga: number;
    image_url: string;
}

export interface User {
    id: string;
    nama: string;
    email: string;
    role: string
}