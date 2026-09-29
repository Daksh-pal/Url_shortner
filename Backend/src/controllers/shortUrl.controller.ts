import { nanoid } from "nanoid";
import { Request, Response } from "express";
import { Url } from "../model/url.Model";
import { prisma } from "../lib/prisma";


export const createShortUrl = async (req: Request, res: Response) => {
    try {
        const { url, slug } = req.body;
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized. User not authenticated." });
        }
        // If URL already exists in database, return the existing record
        // const existingRecord = await Url.findOne({
        //     originalUrl: url,
        //     user: req.user.id
        // });

        const existingRecord = await prisma.url.findUnique({
            where: {
                originalUrl_userId: {
                    originalUrl: url,
                    userId: req.user.id,
                },
            },
        })

        if (existingRecord) {
            return res.status(200).json({ message: "Url fetched successfully", newRec: existingRecord });
        }
        if (slug) {
            const existingShortUrl = await Url.findOne({ shortId: slug });
            if (existingShortUrl) {
                return res.status(400).json({ message: "Custom url already exists" });
            }

            // const shortUrl = await Url.create({
            //     shortId: slug,
            //     originalUrl: url,
            //     user: req.user.id
            // })

            const shortUrl = await prisma.url.create({ data: { shortId: slug, originalUrl: url, userId: req.user.id } })
            return res.status(200).json({ message: "Url generate successfully", newRec: shortUrl });
        }


        const shortId: string = nanoid(8);
        // const newRec = await Url.create({
        //     shortId,
        //     originalUrl: url,
        //     userId: req.user.id
        // });

        const newRec = await prisma.url.create({
            data: {
                shortId,
                originalUrl: url,
                userId: req.user.id
            }
        })

        return res.status(200).json({ message: "Url generate successfully", newRec });
    } catch (error) {
        console.log("Error while creating short url", error);
        return res.status(500).json({ message: "Internal Server error" });
    }
}

export const getRedirectUrl = async (req: Request, res: Response) => {
    try {
        const { shortId } = req.params;
        const record = await prisma.url.update({
            where: {
                shortId
            },
            data: {
                clicks: {
                    increment: 1
                }
            }
        })
        if (!record) return res.status(404).json({ message: "Not found" });
        return res.redirect(record.originalUrl);
    }
    catch (error) {
        console.error("Error while redirecting URL:", error);

        return res.status(500).json({
            message: "Internal server error"
        });

    }
}

export const getAllLinks = async (req: Request, res: Response) => {
    try {
        const { user } = req;
        console.log("--------------", user);
        if (user) {
            const links = await prisma.url.findMany({
                where: { userId: user.id },
                orderBy: { createdAt: "desc" }
            });
            return res.status(200).json({ links });
        }
        return res.status(401).json({ message: "Unauthorized. User not authenticated." });

    } catch (error: unknown) {
        console.error("Error fetching all the links:", error);

        return res.status(500).json({
            message: "Internal Server error",
        });
    }
}

export const deleteLink = async (req: Request, res: Response) => {
    try {
        const { user } = req;

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized. User not authenticated."
            });
        }

        const linkId = Number(req.params.id);

        if (Number.isNaN(linkId)) {
            return res.status(400).json({
                message: "Invalid link ID"
            });
        }

        const result = await prisma.url.deleteMany({
            where: {
                id: linkId,
                userId: user.id
            }
        });

        if (result.count === 0) {
            return res.status(404).json({
                message: "Link not found or you do not have permission to delete it"
            });
        }

        return res.status(200).json({
            message: "Link deleted successfully"
        });

    } catch (error: unknown) {
        console.error("Error deleting link:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};