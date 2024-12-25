import z from "zod";

export const employeeCreateDTO = z.object({
    name: z.string().min(4),
    departmentName: z.string().min(4),
    ktpNumber: z.string().min(16).max(16),
    kkNumber: z.string().min(16).max(16),
    address: z.string().min(4),
    domicile: z.string().min(4),
    taxStatus: z.enum(['K1', 'K2', 'S0']),
    phone: z.string().min(10).max(15),
    email: z.string().email(),
    joinDate: z.coerce.date(),
    emergencyNumber: z.string().min(10).max(15),
    employeeStatus: z.enum(['TETAP', 'KONTRAK', 'MAGANG']),
    gender: z.enum(['LAKI-LAKI', 'PEREMPUAN']),
    leaveQuota: z.number(),
    payRoll: z.number(),
})