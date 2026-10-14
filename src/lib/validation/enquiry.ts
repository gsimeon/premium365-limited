import { z } from "zod";
export const enquirySchema=z.object({name:z.string().trim().min(2).max(120),email:z.string().trim().email().max(254),type:z.enum(["IT services","Product enquiry","Academy / training","Other"]),message:z.string().trim().min(10).max(5000)});
export type EnquiryInput=z.infer<typeof enquirySchema>;
