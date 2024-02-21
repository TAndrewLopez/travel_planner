import { ChipProps } from "@nextui-org/chip";

export const COLUMNS = [
    { name: "ID", uid: "id" },
    { name: "URL", uid: "url" },
    { name: "CREATED AT", uid: "createdAt" },
    { name: "JOB TYPE", uid: "jobType" },
    { name: "STATUS", uid: "status" },
];

export const STATUS_COLOR_MAP: Record<string, ChipProps["color"]> = {
    active: "primary",
    failed: "danger",
    complete: "success",
};

export const STATUS_OPTIONS = [
    { name: "Active", uid: "active" },
    { name: "Failed", uid: "failed" },
    { name: "Complete", uid: "complete" },
];
