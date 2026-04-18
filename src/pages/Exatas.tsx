import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MathBackground from "@/components/MathBackground";
import { questionsService, type Question } from "@/services/questionsService";

const Exatas = () => {
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("all");
  const [selectedOrigin, setSelectedOrigin] = useState<string>("all");
  const [customQuestion, setCustomQuestion] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [solution, setSolution] = useState<{
    summary: string;
    steps: string[];
    finalAnswer: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const allQuestions = questionsService.getQuestions();

  const filteredQuestions = allQuestions.filter((q) => {
    const matchesDiscipline = selectedDiscipline === "all" || q.discipline === selectedDiscipline;
    const matchesOrigin = selectedOrigin === "all" || q.origin === selectedOrigin;
    return matchesDiscipline && matchesOrigin;
  });

  const handleSolveQuestion = async (question: Question) => {
    setIsLoading(true);
    setSelectedQuestion(question);
    setSolution(null);

    try {
      const result = await questionsService.solveQuestion(question.id);
      setSolution(result);
    } catch (error) {
      console.error("Error solving question:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSolveCustom = async () => {
    if (!customQuestion.trim()) return;

    setIsLoading(true);
    setSelectedQuestion(null);
    setSolution(null);

    try {
      const result = await questionsService.solveCustomQuestion(customQuestion);
      setSolution(result);
    } catch (error) {
      console.error("Error solving custom question:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-8 px-4 relative">
      <MathBackground opacity={0.03} />

      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-primary mb-2">
            Exatas
          </h1>
          <p className="text-muted-foreground">
            Resolução guiada de questões de Matemática, Física e Química
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Questions List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>Questões Sugeridas</CardTitle>
                <CardDescription>
                  Selecione uma questão para ver a resolução passo a passo
                </CardDescription>

                {/* Filters */}
                <div className="flex gap-2 mt-4">
                  <Select value={selectedDiscipline} onValueChange={setSelectedDiscipline}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Disciplina" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="matematica">Matemática</SelectItem>
                      <SelectItem value="fisica">Física</SelectItem>
                      <SelectItem value="quimica">Química</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedOrigin} onValueChange={setSelectedOrigin}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Origem" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="ENEM">ENEM</SelectItem>
                      <SelectItem value="Concurso">Concurso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {filteredQuestions.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Nenhuma questão encontrada com os filtros selecionados.
                  </p>
                ) : (
                  filteredQuestions.map((question) => (
                    <Card
                      key={question.id}
                      className="cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => handleSolveQuestion(question)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-sm font-medium line-clamp-2">
                              {question.text}
                            </p>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="secondary">{question.discipline}</Badge>
                              <Badge variant="outline">{question.origin}</Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Custom Question Input */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Questão Própria</CardTitle>
                <CardDescription>
                  Cole aqui sua própria questão para resolver
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Cole sua questão aqui..."
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  className="min-h-[120px]"
                />
                <Button
                  onClick={handleSolveCustom}
                  disabled={!customQuestion.trim() || isLoading}
                  className="mt-4 w-full"
                >
                  Resolver
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column: Solution Display */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Resolução</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-sm text-muted-foreground mt-4">
                      Resolvendo questão...
                    </p>
                  </div>
                ) : solution ? (
                  <div className="space-y-6">
                    {/* Summary */}
                    <div>
                      <h3 className="font-semibold text-sm text-primary mb-2">Resumo</h3>
                      <p className="text-sm text-muted-foreground">{solution.summary}</p>
                    </div>

                    {/* Step by Step */}
                    <div>
                      <h3 className="font-semibold text-sm text-primary mb-2">Passo a Passo</h3>
                      <ol className="list-decimal list-inside space-y-2">
                        {solution.steps.map((step, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Final Answer */}
                    <div className="bg-primary/5 rounded-lg p-4">
                      <h3 className="font-semibold text-sm text-primary mb-2">
                        Resposta Final
                      </h3>
                      <p className="text-sm font-medium">{solution.finalAnswer}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">
                      Selecione uma questão ou cole sua própria para ver a resolução
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Exatas;
