"use client";
import { Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function PropertyTypeTable({ property }: any) {
  const handleEdit = (id: number) => {
    // Implement edit functionality
    console.log(`Edit user with ID: ${id}`);
  };

  const handleDelete = (id: number) => {
    // Implement delete functionality
  };

  return (
    <Card className=" border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px] text-center text-[15px] font-bold">
                ID
              </TableHead>
              <TableHead className="text-center text-[15px] font-bold">
                Name
              </TableHead>
              <TableHead className="text-center text-[15px] font-bold">
                Image
              </TableHead>
              <TableHead className="text-center text-[15px] font-bold">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {property.map((pro: any) => (
              <TableRow key={pro.id} className="border-t border-gray-200">
                <TableCell className="text-center">{pro.id}</TableCell>
                <TableCell className="text-center">{pro.name}</TableCell>
                <TableCell className="text-center flex justify-center">
                  <img
                    src={pro.image}
                    className="w-[50px]  h-[50px] object-cover rounded-full"
                    alt=""
                  />
                </TableCell>
              
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(pro.id)}
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4 text-gray-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(pro.id)}
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-gray-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
