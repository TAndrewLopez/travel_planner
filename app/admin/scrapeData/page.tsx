"use client";

import axios from "axios";
import { useEffect, useState } from "react";

import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Tab, Tabs } from "@nextui-org/tabs";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { Input } from "@nextui-org/input";
import { ADMIN_API_ROUTES } from "@/routes";
import { CurrentScrapingTable, ScrapingQueue } from "@/components/admin/scrapingQueue";

interface ScrapeDataPageProps { }

const ScrapeDataPage: React.FC<ScrapeDataPageProps> = ({ }) => {
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState<string | undefined>(
        undefined
    );
    const [jobs, setJobs] = useState([])

    const searchCities = async (searchQuery: string) => {
        const response = await axios.get(
            `https://secure.geonames.org/searchJSON?q=${searchQuery}&maxRows=5&username=kishan&style=SHORT`
        );
        const parsed = response.data.geonames;
        setCities(parsed.map((city: { name: string }) => city.name ?? []));
        console.log(response);
    };

    const startScraping = async () => {
        const response = await axios.post(ADMIN_API_ROUTES.CREATE_JOB, {
            url: `https://packages.yatra.com/holidays/intl/search.htm?destination=${selectedCity}`,
            jobType: { type: "location" },
        });
    };

    useEffect(() => {
        const getData = async () => {
            const response = await axios.get(ADMIN_API_ROUTES.JOB_DETAILS);
            setJobs(response.data.jobs);
        }
        const interval = setInterval(() => getData(), 3000);
        return () => {
            clearInterval(interval);
        }
    }, [])

    return (
        <section className="m-10 grid grid-cols-3 gap-5">
            <Card className="col-span-2">
                <CardBody>
                    <Tabs>
                        <Tab key="location" title="Location">
                            <Input
                                type="text"
                                label="Search for a location"
                                onChange={(e) => searchCities(e.target.value)}
                            />
                            <div className="w-full min-h-[200px] max-w-[260px] px-1 py-2 rounded-sm border border-default-200 mt-5">
                                <Listbox
                                    aria-label="city_location"
                                    onAction={(key) => setSelectedCity(key as string)}>
                                    {cities.map((city) => (
                                        <ListboxItem
                                            key={city}
                                            color="primary"
                                            className="text-primary-500">
                                            {city}
                                        </ListboxItem>
                                    ))}
                                </Listbox>
                            </div>
                        </Tab>
                    </Tabs>
                </CardBody>
                <CardFooter className="flex flex-col gap-5">
                    <div>
                        {selectedCity && (
                            <h1 className="text-xl">Scrape data for {selectedCity}</h1>
                        )}
                    </div>
                    <Button
                        size="lg"
                        className="w-full"
                        color="primary"
                        onClick={startScraping}>
                        Scrape
                    </Button>
                </CardFooter>
            </Card>
            <ScrapingQueue />
            <div className="col-span-3">
                <CurrentScrapingTable jobs={jobs} />
            </div>
        </section>
    );
};

export default ScrapeDataPage;
