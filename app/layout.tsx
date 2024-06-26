"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import "@/styles/globals.css";
import { users, shownUsers } from "@/config/site";
import { Providers } from "./providers";
import { useRouter } from "next/navigation";
import { clientUser } from "@/config/site";
import { UserCard } from "@/components/userCard";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  //Logic for modals
  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onOpenChange: handleModalOpenChange,
  } = useDisclosure();

  const {
    isOpen: isEntryOpen,
    onOpen: openEntry,
    onOpenChange: handleEntryOpenChange,
  } = useDisclosure();

  // Filter users based on shownUsers and clientUser type
  const visibleUsers = users.filter((user) => {
    return shownUsers.includes(user.id) && user.occupation != clientUser.type;
  });

  // Function to handle adding a user
  const handleAddUser = (userId: number) => {
    shownUsers.push(userId);
    visibleUsers.push(
      users.find((user) => user.id === userId) as {
        id: number;
        name: string;
        avatar: string;
        occupation: string;
        messages: {
          id: number;
          content: string;
          timestamp: Date;
          type: string;
        }[];
      }
    );
  };

  // Default user to add
  const addUser = {
    id: null,
    name:
      clientUser.type === ""
        ? ". . ."
        : clientUser.type === "Doctor"
        ? "Add a patient"
        : "Add a doctor",
    avatar:
      "https://t4.ftcdn.net/jpg/01/14/04/65/360_F_114046562_CoMtlfJGu0WhnDHLMz8qOHtHblQBH9QK.jpg",
    occupation: "",
  };

  // Function to handle client user selection
  const handleUserSelection = (type: string) => {
    clientUser.type = type;
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <div className="relative flex flex-row h-screen">
            <aside className="w-1/4 bg-teal-800 p-4 max-w-sm min-w-48">
              <h2 className="text-lg font-semibold mb-4 text-white font-bold justify-self-center align-items-center">
                {clientUser.type === ""
                  ? ". . ."
                  : clientUser.type === "Doctor"
                  ? "Patients"
                  : "Doctors"}
              </h2>
              <ul className="space-y-2">
                {clientUser.type &&
                  visibleUsers.map((user) => (
                    <li className="text-gray-700" key={user.id}>
                      <UserCard user={user} />
                    </li>
                  ))}
                <li className="text-gray-700">
                  <UserCard user={addUser} onCustomClick={openModal} />
                </li>
              </ul>
            </aside>
            <main className="container mx-auto max-w-7xl flex-grow">
              {children}
              <Modal isOpen={isModalOpen} onOpenChange={handleModalOpenChange}>
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col gap-1">
                        {clientUser.type === ""
                          ? ". . ."
                          : clientUser.type === "Doctor"
                          ? "Add a patient"
                          : "Add a doctor"}
                      </ModalHeader>
                      <ModalBody>
                        <ul className="space-y-2">
                          {users
                            .filter((user) => {
                              return (
                                !shownUsers.includes(user.id) &&
                                user.occupation != clientUser.type
                              );
                            })
                            .map((user) => (
                              <li className="text-gray-700" key={user.id}>
                                <UserCard
                                  user={user}
                                  onCustomClick={() => {
                                    handleAddUser(user.id);
                                    onClose();
                                  }}
                                />
                              </li>
                            ))}
                        </ul>
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="danger"
                          variant="light"
                          onPress={onClose}
                        >
                          Close
                        </Button>
                      </ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal>
              <Modal
                isOpen={!isEntryOpen}
                onOpenChange={handleEntryOpenChange}
                hideCloseButton={true}
                isDismissable={false}
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col gap-1">
                        Are you a patient or a doctor?
                      </ModalHeader>
                      <ModalBody>
                        <Button
                          onPress={() => {
                            handleUserSelection("Patient");
                            onClose();
                          }}
                        >
                          Patient
                        </Button>
                        <Button
                          onPress={() => {
                            handleUserSelection("Doctor");
                            onClose();
                          }}
                        >
                          Doctor
                        </Button>
                      </ModalBody>
                    </>
                  )}
                </ModalContent>
              </Modal>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
