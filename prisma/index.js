const bcrypt = require("bcrypt");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient().$extends({
  model: {
    user: {
      async register(email, password) {
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await prisma.user.create({
          data: { email, password: hashedPassword },
        });
        return user;
      },
      async login(email, password) {
        const user = await prisma.user.findUniqueOrThrow({
          where: { email },
        });
        const calid = await bcrypt.compare(password, user.password);
        if (!valid) throw Error("Password Invalid");
        return user;
      },
    },
  },
});

module.exports = prisma;
