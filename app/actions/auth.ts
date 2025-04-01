"use server"

import { cookies } from "next/headers"
import { connectToDatabase } from "@/lib/mongodb"
import { sign } from "jsonwebtoken"
import bcrypt from "bcryptjs"

const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const COOKIE_NAME = "auth_token"

export async function signup(fullName: string, email: string, password: string) {
  try {
    const { db } = await connectToDatabase()

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email })
    if (existingUser) {
      return { success: false, error: "Email already in use" }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const result = await db.collection("users").insertOne({
      name: fullName,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    })

    if (!result.insertedId) {
      return { success: false, error: "Failed to create user" }
    }

    // Create session
    const user = {
      id: result.insertedId.toString(),
      name: fullName,
      email,
    }

    const token = sign({ user }, JWT_SECRET, { expiresIn: "7d" })

    // Set cookie
    cookies().set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return { success: true }
  } catch (error) {
    console.error("Signup error:", error)
    return { success: false, error: "An error occurred during signup" }
  }
}

export async function login(email: string, password: string) {
  try {
    const { db } = await connectToDatabase()

    // Find user
    const user = await db.collection("users").findOne({ email })

    if (!user) {
      return { success: false, error: "Invalid email or password" }
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return { success: false, error: "Invalid email or password" }
    }

    // Create session
    const sessionUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    }

    const token = sign({ user: sessionUser }, JWT_SECRET, { expiresIn: "7d" })

    // Set cookie
    cookies().set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "An error occurred during login" }
  }
}

export async function logout() {
  cookies().delete(COOKIE_NAME)
  return { success: true }
}

