const express = require("express");
const router = express.Router();
module.exports = router;
//write this last
//like reservations

const prisma = require("../prisma");
const { authenticate } = require("./auth");

router.get("/", authenticate, async (req, res, next) => {
  try {
    const playlists = await prisma.playlist.findMany({
      where: { ownerId: req.user.id },
      include: { playlist: true },
    });
    res.json(playlists);
  } catch (e) {
    next(e);
  }
});

//post new playlist
router.post("/", authenticate, async (req, res, next) => {
  const { name, description, trackIds } = req.body;
  try {
    const playlist = await prisma.playlist.create({
      data: {
        name,
        description,
        ownerId: req.user.id,
        tracks: { connect: tracks },
      },
    });
    res.status(201).json(playlist);
  } catch (e) {
    next(e);
  }
});

//get playlist by id

router.get("/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const playlist = await prisma.playlist.findUniqueOrThrow({
      where: { id: +id },
      include: { tracks: true },
    });
    if (playlist.ownerId !== req.user.id) {
      next({ status: 403, message: "you do not have access to this playlist" });
    }
    res.json(playlist);
  } catch (e) {
    next(e);
  }
});
