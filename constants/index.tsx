import { BiSolidCategory } from "react-icons/bi";
import { FaBookOpen, FaHome, FaHotel } from "react-icons/fa";
import { MdOutlineDataUsage } from "react-icons/md";

export const MENU_ITEMS = [
    { label: "Dashboard", icon: <FaHome />, link: "/admin/dashboard" },
    { label: "Trips", icon: <BiSolidCategory />, link: "/admin/trips" },
    { label: "Hotels", icon: <FaHotel />, link: "/admin/hotels" },
    { label: "Bookings", icon: <FaBookOpen />, link: "/admin/bookings" },
    {
        label: "Scrape Data",
        icon: <MdOutlineDataUsage />,
        link: "/admin/scrape-data",
    },
];
