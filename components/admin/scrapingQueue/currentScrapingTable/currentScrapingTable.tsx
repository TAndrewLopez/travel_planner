"use client";

import { ChangeEvent, Key, useCallback, useMemo, useState } from "react";
import { FaChevronDown, FaSearch } from "react-icons/fa";

import {
    COLUMNS,
    STATUS_COLOR_MAP,
    STATUS_OPTIONS,
} from "@/constants/scrapingTable";
import { JobType } from "@/types/job";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from "@nextui-org/dropdown";
import { Input } from "@nextui-org/input";
import { Link } from "@nextui-org/link";
import { Pagination } from "@nextui-org/pagination";
import {
    Selection,
    SortDescriptor,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@nextui-org/table";

interface CurrentScrapingTableProps {
    jobs: JobType[];
}

export const CurrentScrapingTable: React.FC<CurrentScrapingTableProps> = ({
    jobs,
}) => {
    const [filterValue, setFilterValue] = useState("");
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
    const [statusFilter, setStatusFilter] = useState<Selection>("all");
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "age",
        direction: "ascending",
    });
    const [page, setPage] = useState(1);

    const hasSearchFilter = Boolean(filterValue);
    const headerColumns = COLUMNS;

    const filteredItems = useMemo(() => {
        let filteredUsers = jobs;

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((user) =>
                user.url.toLowerCase().includes(filterValue.toLowerCase())
            );
        }

        if (
            statusFilter !== "all" &&
            Array.from(statusFilter).length !== STATUS_OPTIONS.length
        ) {
            filteredUsers = filteredUsers.filter((user) =>
                Array.from(statusFilter).includes(user.status)
            );
        }

        return filteredUsers;
    }, [jobs, hasSearchFilter, statusFilter, filterValue]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);
    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const renderCell = useCallback((user: JobType, columnKey: Key) => {
        const cellValue = user[columnKey as keyof JobType];

        const formatDateAndTime = (inputDate: string) => {
            const date = new Date(inputDate);

            const options = {
                weekend: "long",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                timeZoneName: "short",
            } as Intl.DateTimeFormatOptions;

            const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
                date
            );

            return formattedDate;
        };

        switch (columnKey) {
            case "url":
                return (
                    <Link href={cellValue} target="_blank">
                        {cellValue}
                    </Link>
                );
            case "jobType":
                return cellValue.type;
            case "createdAt":
                return formatDateAndTime(cellValue);
            case "status":
                return (
                    <Chip
                        className="capitalize"
                        color={STATUS_COLOR_MAP[user.status]}
                        size="sm"
                        variant="flat">
                        {cellValue}
                    </Chip>
                );
            default:
                return cellValue;
        }
    }, []);

    const onNextPage = useCallback(() => {
        if (page < pages) setPage(page + 1);
    }, [page, pages]);

    const onPreviousPage = useCallback(() => {
        if (page > 1) setPage(page - 1);
    }, [page]);

    const onRowsPerPageChange = useCallback(
        (e: ChangeEvent<HTMLSelectElement>) => {
            setRowsPerPage(Number(e.target.value));
            setPage(1);
        },
        []
    );

    const onSearchChange = useCallback((value?: string) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = useCallback(() => {
        setFilterValue("");
        setPage(1);
    }, []);

    const topContent = useMemo(
        () => (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Search by name..."
                        startContent={<FaSearch />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button endContent={<FaChevronDown />} variant="flat">
                                    Status
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={statusFilter}
                                selectionMode="multiple"
                                onSelectionChange={setStatusFilter}>
                                {STATUS_OPTIONS.map((status) => (
                                    <DropdownItem key={status.uid} className="capitalize">
                                        {status.name}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">
                        Total {jobs.length} jobs
                    </span>
                    <label className="flex items-center text-default-400 text-small">
                        Rows per page:
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                    </label>
                </div>
            </div>
        ),
        [
            filterValue,
            onSearchChange,
            statusFilter,
            jobs.length,
            onRowsPerPageChange,
            onClear,
        ]
    );

    const bottomContent = useMemo(
        () => (
            <div className="py-2 px-2 flex justify-between items-center">
                <span className="w-[30%] text-small text-default-400">
                    {selectedKeys === "all"
                        ? "All items selected"
                        : `${selectedKeys.size} of ${filteredItems.length} selected`}
                </span>
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={pages}
                    onChange={setPage}
                />
                <div className="hidden sm:flex w-[30%] justify-end gap-2">
                    <Button
                        isDisabled={pages === 1}
                        size="sm"
                        variant="flat"
                        onPress={onPreviousPage}>
                        Previous
                    </Button>
                    <Button
                        isDisabled={pages === 1}
                        size="sm"
                        variant="flat"
                        onPress={onNextPage}>
                        Next
                    </Button>
                </div>
            </div>
        ),
        [
            selectedKeys,
            filteredItems.length,
            page,
            pages,
            onPreviousPage,
            onNextPage,
        ]
    );

    return (
        <Table
            aria-label="Example table with custom cells, pagination, and sorting"
            isHeaderSticky
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            classNames={{
                wrapper: "max-h-[382px]",
            }}
            selectedKeys={selectedKeys}
            selectionMode="multiple"
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement="outside"
            onSelectionChange={setSelectedKeys}
            onSortChange={setSortDescriptor}>
            <TableHeader columns={headerColumns}>
                {(column) => (
                    <TableColumn
                        key={column.uid}
                        align={column.uid === "actions" ? "center" : "start"}>
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody emptyContent={'No jobs found'} items={items}>
                {
                    (item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => (
                                <TableCell>
                                    {renderCell(item, columnKey)}
                                </TableCell>
                            )}
                        </TableRow>
                    )
                }
            </TableBody>
        </Table>
    );
};
