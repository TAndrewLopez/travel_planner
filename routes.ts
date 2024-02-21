const baseRoute = `${process.env.NEXT_PUBLIC_DOMAIN}/api`

export const ADMIN_API_ROUTES = {
    LOGIN: `${baseRoute}/admin/login`,
    CREATE_JOB: `${baseRoute}/admin/createJob`,
    JOB_DETAILS: `${baseRoute}/admin/jobDetails`,
};
