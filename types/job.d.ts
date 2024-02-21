export interface JobType {
    id: string;
    url: string;
    createdAt: string;
    jobType: any;
    status: "active" | "failed" | "complete"
}