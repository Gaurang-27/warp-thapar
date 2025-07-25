'use client'

import LoadingIcon from "@/lib/LoadingIcon";
import axios from "axios";
import { useState, useTransition } from "react";

interface elemenType {
  userId: string;
  sid: number;
  subType: string;
  startDate: Date | null;
  endDate: Date | null;
  activated: boolean;
  user: {
    email: string;
    phone: string;
  };
}

export default function AdminSubCard({ element }: { element: elemenType }) {
  const [pending, startTransition] = useTransition();

  const currDate = new Date();

  // ✅ Check if subscription is ending in the next 3 days
  const isEndingSoon =
    element.activated &&
    element.endDate &&
    new Date(element.endDate).getTime() - currDate.getTime() <= 3 * 24 * 60 * 60 * 1000;

  const handleActivate = async () => {
    startTransition(async () => {
      try {
        const res = await axios.post(
          '/api/admin/activate-sub',
          { id: element.userId, email: element.user.email },
          { withCredentials: true }
        );
        alert(res.data.message);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const msg = error.response?.data?.error || error.message || 'error';
          alert(msg);
        } else {
          alert('some error');
        }
      }
    });
  };

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        const res = await axios.post(
          `/api/admin/delete-sub?id=${element.userId}&email=${element.user.email}`,
          { id: element.userId },
          { withCredentials: true }
        );
        alert(res.data.message);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const msg = error.response?.data?.error || error.message || 'error';
          alert(msg);
        } else {
          alert('some error');
        }
      }
    });
  };

  const handleMail = async () => {
    startTransition(async () => {
      try {
        const res = await axios.post('/api/admin/send-mail', {
          email: element?.user.email,
        });

        alert(res.data.message);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const msg = error.response?.data.error || error.message || "some error";
          alert(msg);
        } else {
          alert('some error occurred');
        }
      }
    });
  };

  return (
    <div
      className={`shadow-md rounded-2xl p-5 m-10 flex flex-col gap-1 bg-orange-200
        ${isEndingSoon ? 'border-2 border-red-500' : ''}
      `}
    >
      <div>{element.user.email}</div>
      <div>{element.user.phone}</div>

      {element.activated && (
        <div>
          {element.startDate?.toLocaleString('en-IN')} to{' '}
          {element.endDate?.toLocaleString('en-IN')}
        </div>
      )}
      {!element.activated && <div>{element.subType}</div>}

      {element.activated && (
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white rounded-xl p-2 text-md md:w-1/8"
        >
          Delete
        </button>
      )}
      {!element.activated && (
        <button
          className="bg-red-400 text-white rounded-xl p-2 text-md md:w-1/8"
          onClick={handleActivate}
        >
          Activate
        </button>
      )}
      {element.activated && (
        <button
          onClick={handleMail}
          className="bg-red-500 text-white rounded-xl p-2 text-md md:w-1/8"
        >
          Send reminder
        </button>
      )}
      {pending && <LoadingIcon />}
    </div>
  );
}
