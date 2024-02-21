"use client";

import { useEffect, useState } from "react";

import { apiClient } from "@/lib";
import { ADMIN_API_ROUTES } from "@/routes";
import { Card, CardBody, CardHeader } from "@nextui-org/card";

interface ScrapingQueueProps { }

export const ScrapingQueue: React.FC<ScrapingQueueProps> = ({ }) => {
    const [activeJobs, setActiveJobs] = useState(0);

    useEffect(() => {
        const getData = async () => {
            const response = await apiClient.get(ADMIN_API_ROUTES.JOB_DETAILS);
            setActiveJobs(response.data.activeJobs);
        };

        const interval = setInterval(() => getData(), 3000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    const activeJobBackgroundColor = () => {
        if (activeJobs <= 5) return "bg-green-500";
        else if (activeJobs <= 10) return "bg-orange-500";
        else return "bg-red-500";
    };
    const activeJobTextColor = () => {
        if (activeJobs <= 5) return "text-green-500";
        else if (activeJobs <= 10) return "text-orange-500";
        else return "text-red-500";
    };

    return (
        <Card className="h-full">
            <CardHeader>Current Queue</CardHeader>
            <CardBody className="flex items-center justify-center">
                <div
                    className={`h-52 w-52 rounded-full flex items-center justify-center ${activeJobBackgroundColor()}`}>
                    <div className="h-44 w-44 bg-white rounded-full flex items-center justify-center">
                        <h4 className={`text-6xl font-bold ${activeJobTextColor()}`}>
                            {activeJobs}
                        </h4>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};
