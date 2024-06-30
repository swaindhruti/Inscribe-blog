import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";
import {
  createBlogInput,
  updateBlogInput,
} from "@swaindhruti/inscribe-common-modules";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

blogRouter.use("/*", async (c, next) => {
  const authHeader = c.req.header("Authorization") || "";
  const JWT_SECRET = c.env.JWT_SECRET;
  const verifyUser: any = await verify(authHeader, JWT_SECRET);
  try {
    if (verifyUser) {
      c.set("userId", verifyUser.id);
      await next();
    } else {
      c.status(401);
      return c.text("Unauthorized");
    }
  } catch (e) {
    c.status(401);
    return c.text("Unauthorized");
  }
});

blogRouter.post("/create", async (c) => {
  const body = await c.req.json();
  const authorId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const { success } = createBlogInput.safeParse(body);
  if (!success) {
    return c.json({
      message: "Invalid input, please check the input and try again",
    });
  }
  try {
    const blog = await prisma.blog.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: Number(authorId),
      },
    });

    if (!blog) {
      return c.text("Error creating blog");
    }
    return c.json({
      status: "Blog created successfully",
      blog_Id: blog.id,
    });
  } catch (e) {
    c.status(503);
    return c.text("Error creating blog");
  }
});

blogRouter.put("/update/:id", async (c) => {
  const body = await c.req.json();
  const blog_id = c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const { success } = updateBlogInput.safeParse(body);
  if (!success) {
    return c.json({
      message: "Invalid input, please check the input and try again",
    });
  }
  try {
    const blog = await prisma.blog.update({
      where: {
        id: Number(blog_id),
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });

    if (!blog) {
      return c.text("Error updating blog");
    }
    return c.json({
      status: "Blog updated successfully",
    });
  } catch (e) {
    c.status(503);
    return c.text("Error updating blog");
  }
});

blogRouter.get("/get/:id", async (c) => {
  const id = c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blog = await prisma.blog.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!blog) {
      return c.text("Blog doesnot exist");
    }
    return c.json({
      status: "Blog fetched successfully",
      blogDetails: blog,
    });
  } catch (e) {
    c.status(411);
    return c.text("Error fetching the blog");
  }
});

blogRouter.get("/getBulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blog = await prisma.blog.findMany();
    return c.json({
      blog,
    });
  } catch {
    c.status(411);
    return c.text("Error fetching the blogs");
  }
});

blogRouter.delete("/delete/:id", async (c) => {
  const blogId = c.req.param("id");
  const authorId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blog = await prisma.blog.delete({
      where: {
        id: Number(blogId),
      },
    });

    return c.json({
      status: "Blog deleted successfully",
    });
  } catch (e) {
    c.status(503);
    return c.text("Please check the blog id and try again");
  }
});
