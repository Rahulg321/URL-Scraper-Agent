"use server";
import { eq, not } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "./drizzle";
import { deal, todo } from "./schema";

export const getData = async () => {
  const data = await db.select().from(todo);
  return data;
};

export const getAllDeals = async () => {
  // const data = await db
  //   .select({
  //     title: deal.title,
  //     dealType: deal.dealType,
  //   })
  //   .from(deal)
  //   .orderBy(deal.createdAt);
  const data = await db.select().from(deal).orderBy(deal.createdAt);
  return data;
};
