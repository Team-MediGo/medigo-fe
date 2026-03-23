'use client'

import { useState, useEffect } from "react"
import { obatAPI } from "@/lib/api"
import type { Obat } from "@/types/index"

export default function MedicinesPage() {

    const [medicines, setMedicines] = useState<Obat[]>([])
    const [loading, setLoading] = useState(false)

    //state untuk dialog
    const [openAdd, setOpenAdd] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)

    //state untuk obat mana yang sedang dipilih
    const [selected, setSelected] = useState<Obat | null>(null)

    //state untuk form
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
    const CreateObat = async () => {
        const formData = new FormData()
        formData.append('nama', form.nama)
        formData.append('kategori', form.kategori)
        formData.append('harga', form.harga.toString())
        formData.append('stok', form.stok.toString())
        if (form.image) formData.append('image', form.image)

        try {
            await obatAPI.create(formData)
            setOpenAdd(false)
            setForm({ nama: '', kategori: '', harga: 0, stok: 0, image: null })
            fetchMedicines()
        } catch (err) {
            console.log("gagal tambah obat", err)
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

        try {
            await obatAPI.update(selected!.id, formData)
            setOpenEdit(false)
            setSelected(null)
            setForm({ nama: '', kategori: '', harga: 0, stok: 0, image: null })
            fetchMedicines()
        } catch (err) {
            console.error("gagal update obat", err)
        }
    }

    //delete obat
    const handleDelete = async () => {
        if (!selected) return
        try {
            await obatAPI.delete(selected!.id)
            setOpenDelete(false)
            setSelected(null)
            fetchMedicines()
        } catch (err) {
            console.error("gagal delete obat", err)
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
    const openDialogDelete = async (obat: Obat) => {
        setSelected(obat)
        setOpenDelete(true)
    }


    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Medicines</h1>
            <p className="text-gray-500 mt-1">Manage your medicine inventory here.</p>

            <p>total obat: {medicines.length}</p>
            {loading && <p>loading...</p>}
        </div>
    )
}
