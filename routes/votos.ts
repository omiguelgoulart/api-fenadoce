import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

const router = Router();

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "USER",
    pass: "PASS",
  },
});

const votoSchema = z.object({
  clienteId: z.number(),
  candidataId: z.number(),
  justificativa: z.string().optional(),
});

async function enviaEmail(email: string, nome: string, candidata: string) {
  let mensagem = "<h3>Concurso Rainha da Fenadoce</h3>"
  mensagem += `<p>Olá ${nome},</p>`
  mensagem += `<p>Obrigado por votar na candidata ${candidata}.</p>`
  mensagem += "<p>Atenciosamente, Equipe Rainha da Fenadoce</p>"
  

  const info = await transporter.sendMail({
      from: '"Concurso Rainha da Fenadoce"<concursofenadoce@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Confirmação do Voto Rainha da Fenadoce ✔", // Subject line
      text: "Obrigado pelo voto", // plain text body
      html: mensagem, // html body
})
console.log("Message sent: %s", info.messageId);
}

router.get("/", async (req, res) => {
  try {
    const votos = await prisma.voto.findMany({
      include: {
        cliente: true,
        candidata: true,
      },
    });
    res.status(200).json(votos);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

router.post("/", async (req, res) => {
  const valida = votoSchema.safeParse(req.body);
  if (!valida.success) {
    res.status(400).json({ erro: valida.error });
    return;
  }

  try {
    const [voto, candidata] = await prisma.$transaction([
      prisma.voto.create({ data: valida.data }),
      prisma.candidata.update({
        where: { id: valida.data.candidataId },
        data: { numVotos: { increment: 1 } },
      }),
    ]);

    const dadoCliente = await prisma.cliente.findUnique({
      where: { id: valida.data.clienteId },
    });
    const dadoCandidata = await prisma.candidata.findUnique({
      where: { id: valida.data.candidataId },
    });

    enviaEmail(
      dadoCliente?.email as string,
      dadoCliente?.nome as string,
      dadoCandidata?.nome as string
    );
    res.status(201).json({ voto, candidata });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Obtém os dados do voto (no CacheStorage, o id da candidata)
    const dadoVoto = await prisma.voto.findUnique({
      where: { id: Number(id) },
    });
    const [voto, candidata] = await prisma.$transaction([
      prisma.voto.delete({ where: { id: Number(id) } }),
      prisma.candidata.update({
        where: { id: dadoVoto?.candidataId },
        data: { numVotos: { decrement: 1 } },
      }),
    ]);
    res.status(200).json({ voto, candidata });
  } catch (error) {
    res.status(400).json({ erro: error });
  }
});

export default router;
