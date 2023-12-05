"use server";
// write a server action to get stats from the prisma

import prisma from "@/lib/prisma";
import { formSchema, formSchemaType } from "@/schemas/form";
import { currentUser } from "@clerk/nextjs";
import { error } from "console";

export async function GetFormStats() {
  const user = await currentUser();

  if (!user) {
    throw new Error("Un authorized");
  }

  const stats = await prisma.form.aggregate({
    where: {
      userId: user.id,
    },
    _sum: {
      visits: true,
      Submissions: true,
    },
  });

  const visits = stats._sum.visits || 0;
  const Submissions = stats._sum.Submissions || 0;

  let SubmissionRate = 0;

  if (visits > 0) {
    SubmissionRate = (SubmissionRate / visits) * 100;
  }

  const bounceRate = 100 - Submissions;

  return {
    visits,
    Submissions,
    SubmissionRate,
    bounceRate,
  };
}

export async function CreateForm(data: formSchemaType) {
  const validation = formSchema.safeParse(data);
  if (!validation.success) {
    throw new Error("Form not Valid");
  }

  const user = await currentUser();
  if (!user) {
    throw new Error("Un authorized");
  }

  const form = await prisma.form.create({
    data: {
      userId: user.id,
      name: data.name,
      description: data.description,
    },
  });

  if (!form) {
    throw new Error("Form not created");
  }

  return form.Id;
}

export async function GetForms() {
  const user = await currentUser();
  if (!user) {
    throw new Error("Un authorized");
  }

  return await prisma.form.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function GetFormById(formId: number) {
  const user = await currentUser();
  if (!user) {
    throw new Error("Un authorized");
  }
  return await prisma.form.findUnique({
    where: {
      userId: user.id,
      Id: formId,
    },
  });
}

export async function UpdateFormContent(Id: number, jsonContent: string) {
  const user = await currentUser();
  if (!user) {
    throw new Error("Un authorized");
  }
  return await prisma.form.update({
    where: {
      userId: user.id,
      Id: Id,
    },
    data: {
      content: jsonContent,
    },
  });
}

export async function PublishForm(id: number) {
  const user = await currentUser();
  if (!user) {
    throw new Error("Un authorized");
  }

  return await prisma.form.update({
    where: {
      userId: user.id,
      Id: id,
    },
    data: {
      published: true,
    },
  });
}

export async function GetFormContetByUrl(formUrl: string) {
  return prisma.form.update({
    select: {
      content: true,
    },
    data: {
      visits: {
        increment: 1,
      },
    },
    where: {
      shareUrl: formUrl,
    },
  });
}

export async function SubmitForm(formUrl: string, content: string) {
  return prisma.form.update({
    where: {
        shareUrl: formUrl,
        published: true,
    },
    data: {
        Submissions: {
            increment: 1
        },
        FormSubmission: {
          create: {
            content: content,
          }
        }
    }
  });
}



export async function GetFormWithSubmissions(id: number) {
  const user = await currentUser();
  if (!user) {
    throw new Error("Un authorized");
  }

  return await prisma.form.findUnique({
    where: {
      userId: user.id,
      Id: id,
    },
    include: {
      FormSubmission: true,
      
    }
  })
}
