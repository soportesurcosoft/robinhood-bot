import { Request, Response } from "express";
import { getToken } from "../services/token.service";

export async function tokenController(
  req: Request,
  res: Response
) {
  try {
    const { contract } = req.params;

    const token = await getToken(contract);

    res.json(token);
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
}