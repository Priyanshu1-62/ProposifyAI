-- CreateTable
CREATE TABLE "PromptProfile" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "key" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "prupose" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "userPromptTemplate" TEXT NOT NULL,
    "outputSchema" JSONB,
    "temperature" DOUBLE PRECISION NOT NULL,
    "topP" DOUBLE PRECISION NOT NULL DEFAULT 0.9,

    CONSTRAINT "PromptProfile_pkey" PRIMARY KEY ("id")
);
