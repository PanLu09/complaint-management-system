import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { IoTrashBin } from "react-icons/io5";
import { useEffect, useState } from "react";
import axios from "axios";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ListFilter } from "lucide-react";

interface Complaint {
  id: string;
  name: string;
  email: string;
  complaint: string;
  status: string;
  created_at: string;
}

export function ComplaintList() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([
    "Pending",
    "Resolved",
  ]);

  const deleteComplaint = (id: string) => {
    axios.delete(`http://localhost:3001/complaints/${id}`);
  };

  const toggleStatus = (id: string) => {
    axios.patch(`http://localhost:3001/complaints/${id}`);
  };

  useEffect(() => {
    axios
      .get("http://localhost:3001/complaints")
      .then((res) => setComplaints(res.data));
  }, [complaints]);
  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <Table>
        <TableCaption>A list of recent user complaints.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Complaint message</TableHead>
            <TableHead>Submission date</TableHead>
            <TableHead>
              <div className="flex items-center space-x-2">
                <Label>Status</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <ListFilter/>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuCheckboxItem
                      checked={statusFilter.includes("Pending")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setStatusFilter((prev) => [...prev, "Pending"]);
                        } else {
                          setStatusFilter((prev) =>
                            prev.filter((s) => s !== "Pending")
                          );
                        }
                      }}
                    >
                      Pending
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={statusFilter.includes("Resolved")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setStatusFilter((prev) => [...prev, "Resolved"]);
                        } else {
                          setStatusFilter((prev) =>
                            prev.filter((s) => s !== "Resolved")
                          );
                        }
                      }}
                    >
                      Resolved
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {complaints
            .filter((c) => statusFilter.includes(c.status))
            .map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.complaint}</TableCell>
                <TableCell>{c.created_at}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={c.status === "Resolved"}
                      onCheckedChange={() => toggleStatus(c.id)}
                    ></Switch>
                    <Label>{c.status}</Label>
                  </div>
                </TableCell>
                <TableCell
                  onClick={() => {
                    deleteComplaint(c.id);
                  }}
                >
                  <IoTrashBin />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
