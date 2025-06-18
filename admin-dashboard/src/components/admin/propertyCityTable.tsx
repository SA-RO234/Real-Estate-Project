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

export default function LocationTable({ location }: any) {
  const handleEdit = (id: number) => {
    // Implement edit functionality
    console.log(`Edit user with ID: ${id}`);
  };

  const handleDelete = (id: number) => {
    // Implement delete functionality
  };

  return (
    <Card className="shadow-md border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px] text-center text-[15px] font-bold">
                ID
              </TableHead>
              <TableHead className="text-center text-[15px] font-bold">
                City/Province
              </TableHead>
              <TableHead className="text-center text-[15px] font-bold">
                Country
              </TableHead>
              <TableHead className="text-center text-[15px] font-bold">
                Images
              </TableHead>
              <TableHead className="text-center text-[15px] font-bold">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {location.map((location: any) => (
              <TableRow key={location.id} className="border-t border-gray-200">
                <TableCell className="text-center">{location.id}</TableCell>
                <TableCell className="text-center">{location.city}</TableCell>
                <TableCell className="text-center">{location.country}</TableCell>
                <TableCell className="text-center flex justify-center">
                  <img
                    src={location.city_image}
                    className="w-[50px]  h-[50px] object-cover rounded-full"
                    alt=""
                  />
                </TableCell>

                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(location.id)}
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4 text-gray-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(location.id)}
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
