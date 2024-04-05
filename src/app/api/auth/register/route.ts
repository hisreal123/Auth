import bcrypt from "bcrypt";
import prisma from "../../../../../prisma";
import { NextResponse } from "next/server";

export const connectToDB = async () => {
  try {
    await prisma.$connect();
  } catch (error) {
    throw new Error("Unable to connect to database !!");
  }
};

export const POST = async (req: Request) => {
  try {
    const { name, email, password } = await req.json();
    console.log({ name, email, password });
    if (!name || !email || !password)
      return NextResponse.json({ mesage: "Invalid  data" }, { status: 400 });
    await connectToDB();
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log({ name, email, hashedPassword });

    const newUser = await prisma.user.create({
      data: { email, name, hashedPassword },
    });
    return NextResponse.json({ newUser }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: " Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
