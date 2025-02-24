import { Deal } from "@/lib/db/schema";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const DealCard = ({ deal }: { deal: Deal }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Title:- {deal.title}</CardTitle>
        <CardDescription>{deal.dealType}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{deal.dealCaption}</p>
      </CardContent>
      <CardFooter className="flex flex-col">
        <span className="block">Brokerage:- {deal.brokerage}</span>
        <span className="block">Industry:- {deal.industry}</span>
      </CardFooter>
    </Card>
  );
};

export default DealCard;
