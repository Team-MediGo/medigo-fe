'use client'

import { useState, useEffect } from "react"
import { obatAPI } from "@/lib/api"
import type { Obat } from "@/types/index"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2, Search, Package, Badge, Eye } from 'lucide-react'


export default function MedicinesPage() {

    const [medicines, setMedicines] = useState<Obat[]>([])
    const [loading, setLoading] = useState(false)

    //state untuk dialog
    const [openAdd, setOpenAdd] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)
    const [openDetailObat, setOpenDetailObat] = useState(false)

    //state untuk obat mana yang sedang dipilih
    const [selected, setSelected] = useState<Obat | null>(null)

    //state untuk form add and edit
    const [form, setForm] = useState({
        nama: '',
        kategori: '',
        harga: 0,
        stok: 0,
        image: null as File | null
    })

    //get all obat
    const fetchMedicines = async () => {
        setLoading(true)
        try {
            const res = await obatAPI.getAll()
            setMedicines(res.data.data)
        } catch (err) {
            console.error("gagal megambil data obat", err)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchMedicines()
    }, [])

    //create obat
    const handleCreateObat = async () => {
        const formData = new FormData()
        formData.append('nama', form.nama)
        formData.append('kategori', form.kategori)
        formData.append('harga', form.harga.toString())
        formData.append('stok', form.stok.toString())
        if (form.image) formData.append('image', form.image)

        setLoading(true)
        try {
            await obatAPI.create(formData)
            setOpenAdd(false)
            setForm({ nama: '', kategori: '', harga: 0, stok: 0, image: null })
            fetchMedicines()
        } catch (err) {
            console.log("gagal tambah obat", err)
            setLoading(false)
        }
    }

    //update obat
    const UpdateObat = async () => {
        const formData = new FormData()
        formData.append('nama', form.nama)
        formData.append('kategori', form.kategori)
        formData.append('harga', form.harga.toString())
        formData.append('stok', form.stok.toString())
        if (form.image) formData.append('image', form.image)

        setLoading(true)
        try {
            await obatAPI.update(selected!.id, formData)
            setOpenEdit(false)
            setSelected(null)
            setForm({ nama: '', kategori: '', harga: 0, stok: 0, image: null })
            fetchMedicines()
        } catch (err) {
            console.error("gagal update obat", err)
            setLoading(false)
        }
    }

    //delete obat
    const handleDelete = async () => {
        if (!selected) return
        setLoading(true)
        try {
            await obatAPI.delete(selected!.id)
            setOpenDelete(false)
            setSelected(null)
            fetchMedicines()
        } catch (err) {
            console.error("gagal delete obat", err)
            setLoading(false)
        }
    }

    //open edit dialog
    const openEditDialog = async (obat: Obat) => {
        setSelected(obat)
        setForm({
            nama: obat.nama,
            kategori: obat.kategori,
            harga: obat.harga,
            stok: obat.stok,
            image: null
        })
        setOpenEdit(true)
    }

    //open dialog delete
    const openDialogDelete = (obat: Obat) => {
        setSelected(obat)
        setOpenDelete(true)
    }

    //open detail obat
    const detailObat = (obat: Obat) => {
        setSelected(obat)
        setOpenDetailObat(true)
    }

    //kategori
    const KATEGORI = ['analgesik', 'antibiotik', 'antiviral', 'antijamur', 'antihistamin', 'antiseptik', 'obat bebas', 'obat resep', 'obat herbal', 'obat khusus', 'vitamin', 'antasida']

    //badge stok and format rupiah
    const formatRupiah = (num: Number) => 'Rp' + num.toLocaleString('id-ID')
    const StockBadge = ({ stok }: { stok: number }) => {
        if (stok === 0) return <p className="bg-red-100 text-red-700 hover:bg-red-100 rounded-xl w-20  text-center">Habis</p>
        if (stok < 20) return <p className="bg-amber-100 text-amber-700 hover:bg-amber-100 rounded-xl w-30  text-center">Stok Rendah</p>
        return <p className="bg-green-100 text-green-700 hover:bg-green-100 rounded-xl w-20  text-center">Tersedia</p>
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="">
                    <h1 className="text-2xl font-bold">Medicines</h1>
                    <p className="text-gray-500 mt-1">Manage your medicine inventory here.</p>
                </div>
                <Button className="bg-green-600 hover:bg-green-700 gap-2" onClick={() => setOpenAdd(true)}>
                    <Plus size={16} /> Tambah Obat
                </Button>
            </div>

            {/* Modal Create Obat */}
            <Dialog open={openAdd} onOpenChange={setOpenAdd}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="font-semibold">Tambah Obat</DialogTitle>
                        <DialogDescription>Masukan data obat baru</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        {/* Nama */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">Nama Obat</label>
                            <Input
                                className="mt-1"
                                placeholder="contoh: Paracetamol 500mg"
                                value={form.nama}
                                onChange={e => setForm({ ...form, nama: e.target.value })}
                            />
                        </div>
                        {/* Kategori */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">Kategori</label>
                            <Select value={form.kategori} onValueChange={v => setForm({ ...form, kategori: v })}>
                                <SelectTrigger className="w-full mt-1">
                                    <SelectValue placeholder="Pilih Kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    {KATEGORI.map(k => (
                                        <SelectItem key={k} value={k}>
                                            {k}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Harga */}
                        <div>
                            <label className="text-sm text-gray-700">Harga (Rp)</label>
                            <Input type='number' placeholder="Contoh: 10" className="mt-1 w-full" value={form.harga} onChange={e => setForm({ ...form, harga: Number(e.target.value) })}>
                            </Input>
                        </div>

                        {/* Stok */}
                        <div>
                            <label className="text-sm text-gray-700">Stok</label>
                            <Input type='number' placeholder="Contoh: 5" className="mt-1 w-full" value={form.stok} onChange={e => setForm({ ...form, stok: Number(e.target.value) })}>
                            </Input>
                        </div>

                        {/* Image */}
                        <div>
                            <label className="text-sm text-gray-700">Image</label>
                            <Input type="file" className="mt-1" accept="image/*" onChange={e => setForm({ ...form, image: e.target.files?.[0] || null })} />
                        </div>

                        {/* Button */}
                        <DialogFooter>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => {
                                    setOpenAdd(false)
                                    setForm({ nama: '', kategori: '', harga: 0, stok: 0, image: null })
                                }}>Cancel</Button>
                                <Button
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={handleCreateObat}
                                    disabled={loading}
                                >
                                    {loading ? 'Menyimpan...' : 'Tambah'}
                                </Button>
                            </div>
                        </DialogFooter>

                    </div>
                </DialogContent>

            </Dialog>

            {/* tabel obat */}
            <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm bg-white">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead>Gambar</TableHead>
                            <TableHead>Nama Obat</TableHead>
                            <TableHead>Kategori</TableHead>
                            <TableHead>Harga</TableHead>
                            <TableHead>Stok</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* loading state */}
                        {loading && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10 text-gray-400">
                                    Memuat Data...
                                </TableCell>
                            </TableRow>
                        )}
                        {/* empty */}
                        {!loading && medicines.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10 text-gray-400">
                                    <Package className="flex items-center mx-auto my-2" />
                                    Belum ada data obat
                                </TableCell>
                            </TableRow>
                        )}
                        {/* data obat */}
                        {!loading && medicines.map((obat) => (
                            <TableRow key={obat.id} className="hover:bg-gray-50">
                                <TableCell>
                                    {obat.image_url ? (
                                        <img src={obat.image_url} alt={obat.nama} className="w-10 h-10 rounded-lg object-cover border border-gray-100"></img>
                                    ) : (
                                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex-items-center justify-center">
                                            <Package size={16} className="text-gray-400">

                                            </Package>
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="font-medium text-gray-900">{obat.nama}</TableCell>
                                <TableCell className="capitalize text-gray-600">{obat.kategori}</TableCell>
                                <TableCell className="text-gray-800">{formatRupiah(obat.harga)}</TableCell>
                                <TableCell className="text-gray-800">{obat.stok}</TableCell>
                                <TableCell><StockBadge stok={obat.stok} /></TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="icon" onClick={() => detailObat(obat)}><Eye size={16} /></Button>
                                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(obat)}>
                                        <Pencil size={16} />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => openDialogDelete(obat)}>
                                        <Trash2 size={16} />
                                    </Button>
                                </TableCell>



                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
            </div>

            {/* modal view detail obat */}
            <Dialog open={openDetailObat} onOpenChange={setOpenDetailObat}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Detail Obat</DialogTitle>
                    </DialogHeader>
                    {selected && (
                        <div className="flex flex-row">
                            {/* gambar */}
                            <div className="">
                                {selected.image_url ? (
                                    <img src={selected.image_url} alt={selected.nama} className="rounded rounded-xl h-60 mx-auto" />

                                ) : (
                                    <Package size={14} className="text-gray-400" />

                                )}
                            </div>

                            {/* title */}
                            <div className="ml-4">
                                <div className="">
                                    <label className="font-semibold">Nama Obat:</label>
                                    <div className="">{selected.nama}</div>
                                </div>

                                <div className="">
                                    <label className="font-semibold">Kategori:</label>
                                    <div className="">{selected.kategori}</div>
                                </div>

                                <div className="">
                                    <label className="font-semibold">Harga:</label>
                                    <div className="">{formatRupiah(selected.harga)}</div>
                                </div>

                                <div className="">
                                    <label className="font-semibold">Stok:</label>
                                    <div className="">{selected.stok}</div>
                                </div>

                                <div className="">
                                    <label className="font-semibold">Status:</label>
                                    <div className="mt-1"><StockBadge stok={selected.stok} /></div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
            {/* modal edit */}
            <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Obat</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Nama Obat</label>
                            <Input
                                className="mt-1"
                                value={form.nama}
                                onChange={e => setForm({ ...form, nama: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Kategori</label>
                            <Select value={form.kategori} onValueChange={v => setForm({ ...form, kategori: v })}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {KATEGORI.map(c => (
                                        <SelectItem key={c} value={c}>
                                            {c.charAt(0).toUpperCase() + c.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Harga (Rp)</label>
                                <Input
                                    className="mt-1"
                                    type="number"
                                    value={form.harga}
                                    onChange={e => setForm({ ...form, harga: Number(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Stok</label>
                                <Input
                                    className="mt-1"
                                    type="number"
                                    value={form.stok}
                                    onChange={e => setForm({ ...form, stok: Number(e.target.value) })}
                                />
                            </div>
                        </div>

                        {/* Preview gambar lama */}
                        {selected?.image_url && (
                            <div>
                                <label className="text-sm font-medium text-gray-700">Gambar Saat Ini</label>
                                <img
                                    src={selected.image_url}
                                    alt={selected.nama}
                                    className="mt-1 w-20 h-20 rounded-lg object-cover border border-gray-100"
                                />
                            </div>
                        )}

                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Ganti Gambar <span className="text-gray-400">(opsional)</span>
                            </label>
                            <Input
                                className="mt-1"
                                type="file"
                                accept="image/*"
                                onChange={e => setForm({ ...form, image: e.target.files?.[0] ?? null })}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setOpenEdit(false)
                                setSelected(null)
                                setForm({ nama: '', kategori: '', harga: 0, stok: 0, image: null })
                            }}
                        >
                            Batal
                        </Button>
                        <Button
                            className="bg-green-600 hover:bg-green-700"
                            onClick={UpdateObat}
                            disabled={loading}
                        >
                            {loading ? 'Menyimpan...' : 'Update'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


            {/* ── modal delete ── */}
            <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Obat</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-gray-600 py-2">
                        Apakah kamu yakin ingin menghapus{' '}
                        <span className="font-semibold text-gray-900">{selected?.nama}</span>
                    </p>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setOpenDelete(false)
                                setSelected(null)
                            }}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={loading}
                        >
                            {loading ? 'Menghapus...' : 'Hapus'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


        </div>
    )
}
