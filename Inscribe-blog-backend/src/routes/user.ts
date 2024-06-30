import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { signupInput, loginInput } from "@swaindhruti/inscribe-common-modules";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

userRouter.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const { success } = signupInput.safeParse(body);
  if (!success) {
    return c.json({
      message: "Invalid input, please check the input and try again",
    });
  }
  try {
    const user = await prisma.user.create({
      data: {
        name: body.name,
        username: body.username,
        password: body.password,
      },
    });
    const JWT_SECRET = c.env.JWT_SECRET;
    const jwt = await sign(
      { id: user.id, username: user.username },
      JWT_SECRET
    );
    return c.json({
      JWT_token: jwt,
      status: "user created successfully",
    });
  } catch (e) {
    return c.text("The user already exists, try another username");
  }
});

userRouter.post("/login", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const { success } = loginInput.safeParse(body);
  if (!success) {
    return c.json({
      message: "Invalid input, please check the input and try again",
    });
  }
  try {
    const user = await prisma.user.findFirst({
      where: {
        username: body.username,
        password: body.password,
      },
    });
    if (!user) {
      return c.text("User not found");
    }
    const JWT_SECRET = c.env.JWT_SECRET;
    const jwt = await sign(
      { id: user.id, username: user.username },
      JWT_SECRET
    );
    return c.json({
      JWT_token: jwt,
      status: "user logged in successfully",
    });
  } catch (e) {
    c.status(403);
    return c.text("Invalid username or password");
  }
});
