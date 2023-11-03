import { Download, Share2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import {
  H1,
  H2,
  LargeText,
  MutedText,
  Paragraph,
} from "~/components/ui/typography";
import { useToast } from "~/components/ui/use-toast";
import { useFormatRelativeDate } from "~/hooks/use-format-relative-date";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";
import { parseId } from "~/utils/parse-id";
import { shuffleArray } from "~/utils/shuffle-array";

export default function NoteDetail() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data: sessionData } = useSession();
  const { toast } = useToast();
  const formatter = useFormatRelativeDate();

  // TODO: SSR
  const { data, isLoading, isError, error } = api.note.get.useQuery(
    {
      id,
    },
    {
      enabled: !!id,
      refetchOnWindowFocus: false,
    },
  );

  const { mutateAsync: deleteNote } = api.note.delete.useMutation({
    async onSuccess() {
      toast({
        title: "Note deleted",
        description: "The note was deleted",
        duration: 5000,
      });
      await router.push("/notes");
    },
    onError(error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  const shareNote = async () => {
    if (!data) {
      return;
    }

    try {
      const url = window.location.href;
      const cleanedUrl = url.includes("#") ? url.split("#")[0]! : url;

      if (navigator.share && window.navigator.userAgent.includes("Mobile")) {
        await navigator.share({
          title: data.title,
          text: data.description ?? undefined,
          url: cleanedUrl,
        });
      } else {
        await navigator.clipboard.writeText(cleanedUrl);

        toast({
          title: "Copied to clipboard",
          description: "The note url was copied to your clipboard",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error(error);

      toast({
        title: "Error",
        description: "Failed to share note",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <>
      <Head>
        {/* TODO: SEO */}
        <title>Note</title>
      </Head>
      <main className="flex flex-col items-center">
        <div className="w-2/3 space-y-6">
          {data.sections.map((section, idx) => {
            if (idx === 0) {
              return (
                <div className="flex space-x-6" key={section.id}>
                  <div className="w-1/3 space-y-6 border-r pr-6">
                    <H1>{data.title}</H1>

                    <Paragraph>{data.description}</Paragraph>

                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={data.user.image ?? undefined}
                          alt={data.user.name ?? undefined}
                        />
                        <AvatarFallback>
                          {data.user.name
                            ? data.user.name?.charAt(0).toUpperCase() +
                              data.user.name?.charAt(1).toUpperCase()
                            : "??"}
                        </AvatarFallback>
                      </Avatar>

                      <LargeText>
                        <Link href="">{data.user.name}</Link>
                      </LargeText>
                    </div>

                    {sessionData?.user.id === data.user.id ? (
                      <div className="flex gap-4">
                        <Button asChild className="w-full">
                          <Link href={`/notes/${id}/update`}>Edit</Link>
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          className="w-full"
                          onClick={async () => await deleteNote({ id })}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : null}

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={shareNote}
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <MutedText>
                            Created {formatter(data.createdAt)}.
                          </MutedText>
                        </TooltipTrigger>
                        <TooltipContent>
                          Created {data.createdAt.toLocaleDateString()}.
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {data.updatedAt.getTime() !== data.createdAt.getTime() ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <MutedText>
                              Updated {formatter(data.updatedAt)}.
                            </MutedText>
                          </TooltipTrigger>
                          <TooltipContent>
                            Updated {data.updatedAt.toLocaleDateString()}.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : null}
                  </div>
                  <Section {...section} key={section.id} />
                </div>
              );
            }
            return <Section {...section} key={section.id} />;
          })}
        </div>
      </main>
    </>
  );
}

type SectionProps = {
  id: string;
  type: "TEXT" | "QUIZ" | "IMAGE" | "VIDEO" | "AUDIO" | "FILE";
  index: number;
  subtitle: string | null;
  content: string | null;
  file: string | null;
  quizAnswers: {
    id: string;
    answer: string;
    isCorrect: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
};

function Section({
  subtitle,
  id,
  content,
  type,
  quizAnswers,
  file,
}: SectionProps) {
  const router = useRouter();
  const subtitleId = subtitle ? parseId(subtitle, id) : "";

  return (
    <div className="w-full">
      <H2>
        <Link href={`${router.asPath}#${subtitleId}`}>{subtitle}</Link>
      </H2>

      <div
        className="prose lg:prose-md leading-relaxed"
        dangerouslySetInnerHTML={{ __html: content ?? "" }}
      />

      {type === "QUIZ" ? (
        <SectionQuiz quizAnswers={quizAnswers} />
      ) : type === "IMAGE" ? (
        <SectionImage file={file!} />
      ) : type === "AUDIO" ? (
        <SectionAudio file={file!} />
      ) : type === "VIDEO" ? (
        <SectionVideo file={file!} />
      ) : type === "FILE" ? (
        <SectionFile file={file!} />
      ) : null}
    </div>
  );
}

type SectionQuizProps = {
  quizAnswers: {
    id: string;
    answer: string;
    isCorrect: boolean;
  }[];
};

function SectionQuiz({ quizAnswers }: SectionQuizProps) {
  const [selectedOption, setSelectedOption] = useState("");

  const correctAnswer = quizAnswers.find((answer) => answer.isCorrect)!.id;

  const shuffledAnswers = useMemo(
    () => shuffleArray(quizAnswers),
    [quizAnswers],
  );

  const onSelectAnswer = (answer: {
    id: string;
    answer: string;
    isCorrect: boolean;
  }) => {
    setSelectedOption(answer.id);
  };

  const getAnswerClasses = (answerId: string) => {
    if (selectedOption) {
      if (selectedOption === correctAnswer && answerId === correctAnswer) {
        return "text-green-500";
      } else if (selectedOption === answerId) {
        return "text-red-500";
      }
    }
    return "";
  };

  const resetQuiz = () => {
    setSelectedOption("");
  };

  return (
    <div className="flex flex-col gap-4">
      {shuffledAnswers.map((answer) => (
        <Button
          key={answer.id}
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => onSelectAnswer(answer)}
          disabled={!!selectedOption}
        >
          <span className={cn("ml-2", getAnswerClasses(answer.id))}>
            {answer.answer}
          </span>
        </Button>
      ))}

      {selectedOption ? (
        <Button type="button" variant="secondary" onClick={resetQuiz}>
          Reset
        </Button>
      ) : null}
    </div>
  );
}

type SectionImageProps = {
  file: string;
};

function SectionImage({ file }: SectionImageProps) {
  return (
    <img
      src={file}
      alt=""
      className="mx-auto mb-4 h-auto max-h-[600px] w-full"
    />
  );
}

type SectionAudioProps = {
  file: string;
};

function SectionAudio({ file }: SectionAudioProps) {
  return (
    <audio controls className="mx-auto mb-4 h-auto max-h-[600px] w-full">
      <source type="audio/mp3" src={file} />
      Your browser does not support the audio element.
    </audio>
  );
}

type SectionVideoProps = {
  file: string;
};

function SectionVideo({ file }: SectionVideoProps) {
  return (
    <video controls className="mx-auto mb-4 h-auto max-h-[600px] w-full">
      <source type="video/mp4" src={file} />
      Your browser does not support the video element.
    </video>
  );
}

type SectionFileProps = {
  file: string;
};

function SectionFile({ file }: SectionFileProps) {
  const fileName = file.split("/").pop()!;

  return (
    <Button asChild variant="outline">
      <a href={file} download="true">
        <Download className="mr-2 h-4 w-4" />
        {fileName}
      </a>
    </Button>
  );
}
