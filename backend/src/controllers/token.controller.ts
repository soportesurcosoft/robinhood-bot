import type { Request, Response } from "express";
import {
  getToken,
  InvalidTokenAddressError,
} from "../services/token.service.js";

export async function tokenController(req: Request, res: Response) {
  try {
    const contract = req.params.contract;

    if (!contract) {
      res.status(400).json({
        error: "A token contract address is required.",
      });
      return;
    }

    const token = await getToken(contract);

    res.json(token);
  } catch (error) {
    if (error instanceof InvalidTokenAddressError) {
      res.status(400).json({
        error: error.message,
      });
      return;
    }

    res.status(500).json({
      error: "Unable to inspect the token.",
    });
  }
}