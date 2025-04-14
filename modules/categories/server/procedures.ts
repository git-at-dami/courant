import { database } from "@/database";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { categories } from '@/database/schema';


export const categoriesRouter = createTRPCRouter({
    getMany: baseProcedure.query(async () => {
        const categoriesList  = await database.select().from(categories);

        return categoriesList;
    }),
});