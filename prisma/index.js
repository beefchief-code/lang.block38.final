const bcrypt = require("bcrypt");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient().$extends({
  model: {
    user: {
      async register(username, password) {
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await prisma.user.create({
          data: { username, password: hashedPassword },
        });
        return user;
      },
      async login(username, password) {
        const user = await prisma.user.findUniqueOrThrow({
          where: { username },
        });
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw Error("Password Invalid");
        return user;
      },
    },
  },
});

module.exports = prisma;
