import { GetFormStats, GetForms } from "@/actions/Form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ReactNode, Suspense } from "react";
import { LuView } from "react-icons/lu";
import { FaWpforms } from "react-icons/fa";
import { HiCursorClick } from "react-icons/hi";
import { TbArrowBounce } from "react-icons/tb";
import { Separator } from "@/components/ui/separator";
import CreateformBtn from "@/components/CreateformBtn";
import { Form } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from "date-fns";
import { date } from "zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BiRightArrowAlt } from "react-icons/bi";

import { FaEdit } from "react-icons/fa";

const Home = () => {
  return (
    <div className="w-full">
      <Suspense fallback={<StatsCards loading={true} />}>
        <CardStatsWrapper />
      </Suspense>

      <Separator className="my-6" />
      <h2 className="text-4xl font-bold col-span-2">Your Forms</h2>
      <Separator className="my-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CreateformBtn />
        <Suspense fallback={[1,2,3,4].map(el => <FormCardSkeleton key={el} />)}><FormCards /></Suspense>
      </div>
    </div>
  );
};

export default Home;

const CardStatsWrapper = async () => {
  "use server";
  const stats = await GetFormStats();
  return <StatsCards loading={false} data={stats} />;
};

interface StateCardsProps {
  data?: Awaited<ReturnType<typeof GetFormStats>>;
  loading: boolean;
}

const StatsCards = (props: StateCardsProps) => {
  const { data, loading } = props;
  return (
    <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  ">
      <StatsCard
        title="Total visits"
        icon={<LuView className="text-blue-600" />}
        helperText="All time visits"
        value={data?.visits.toLocaleString() || ""}
        loading={loading}
        className="shadow-md shadow-blue-600"
      />

      <StatsCard
        title="Total Sumbissions"
        icon={<FaWpforms className="text-yellow-600" />}
        helperText="All time Submissions"
        value={data?.Submissions.toLocaleString() || ""}
        loading={loading}
        className="shadow-md shadow-yellow-600"
      />

      <StatsCard
        title="Submission Rate"
        icon={<HiCursorClick className="text-green-600" />}
        helperText="Visits that result in form submission"
        value={data?.SubmissionRate.toLocaleString() + "%" || ""}
        loading={loading}
        className="shadow-md shadow-green-600"
      />

      <StatsCard
        title="Bounce Rate"
        icon={<TbArrowBounce className="text-red-600" />}
        helperText="Visits that leave without interactivity"
        value={data?.SubmissionRate.toLocaleString() + "%" || ""}
        loading={loading}
        className="shadow-md shadow-red-600"
      />
    </div>
  );
};

export const StatsCard = ({
  title,
  icon,
  helperText,
  value,
  loading,
  className,
}: {
  title: String;
  icon: ReactNode;
  helperText: String;
  value: String;
  loading: Boolean;
  className: string;
}) => {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading && (
            <Skeleton>
              <span>0</span>
            </Skeleton>
          )}
        </div>
        {!loading && <>{value}</>}
        <p className="text-xs text-muted-foreground pt-1">{helperText}</p>
      </CardContent>
    </Card>
  );
};

const FormCardSkeleton = () => {
  return <Skeleton className="border border-primary h-[190px] w-full" />;
};

const FormCards = async () => {
  const forms = await GetForms();

  return (
    <>
      {forms.map((form) => (
        <FormCard key={form.Id} form={form} />
      ))}
    </>
  );
};

const FormCard = ({ form }: { form: Form }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span className="truncate font-bold">
            {form.name}
          </span>
          {form.published ? (<Badge>Published</Badge>) : (<Badge variant={"destructive"}>Draft</Badge>)}
        </CardTitle>
        <CardDescription className="flex justify-between text-muted-foreground text-sm ">
          {formatDistance(form.createdAt, new Date(), {
            addSuffix: true,
          })}

          {form.published && (
            <span className="flex items-center gap-2">
              <LuView className="text-muted-foreground" />
              <span>{form.visits.toLocaleString()}</span>
              <FaWpforms className="text-muted-foreground" />
              <span>{form.Submissions.toLocaleString()}</span>
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[20px] truncate text-sm text-muted-foreground " >
            {form.description || "No Description"}
      </CardContent>
      <CardFooter>
        {form.published && (
          <Button asChild className="w-full mt-2 gap-4">
            <Link href={`/forms/${form.Id}`}>View Submissions <BiRightArrowAlt /></Link>
          </Button>
        )}
        {!form.published && (
          <Button asChild variant={"secondary"} className="w-full mt-2 gap-4">
            <Link href={`/builder/${form.Id}`}>Edit Form <FaEdit /></Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
