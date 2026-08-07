"use client";

import { useId, useState, type FormEvent } from "react";
import { COMPANY, REQUEST_SERVICES } from "@/lib/content";
import { cn } from "@/lib/utils";

interface FormState {
  name: string;
  service: string;
  message: string;
}

type Errors = Partial<Record<keyof FormState, string>>;

const EMPTY: FormState = { name: "", service: "", message: "" };

/** WhatsApp number without the `+`, as wa.me expects. */
const WHATSAPP_NUMBER = COMPANY.phone.replace(/[^\d]/g, "");

/**
 * Project request form.
 *
 * Composes the enquiry into a WhatsApp message and hands off to wa.me — the
 * same flow the previous site used, and the one this business actually
 * answers on. There is no backend, so nothing is stored or transmitted
 * anywhere the visitor cannot see.
 *
 * Validation is client-side and announced: each field owns an error node
 * referenced by `aria-describedby`, and the summary is a live region.
 */
export function ProjectRequestForm() {
  const id = useId();
  const [values, setValues] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const update = (field: keyof FormState) => (value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) =>
      current[field] ? { ...current, [field]: undefined } : current,
    );
  };

  const validate = (state: FormState): Errors => {
    const next: Errors = {};
    if (state.name.trim().length < 2) next.name = "من فضلك اكتب الاسم كاملاً.";
    if (!state.service) next.service = "اختر نوع المشروع.";
    if (state.message.trim().length < 10)
      next.message = "اكتب تفاصيل أوضح عن المشروع (١٠ أحرف على الأقل).";
    return next;
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      // Move focus to the first problem so keyboard users are not stranded.
      const firstField = Object.keys(found)[0];
      document.getElementById(`${id}-${firstField}`)?.focus();
      return;
    }

    const text = [
      "طلب عرض سعر — من الموقع الإلكتروني",
      `الاسم / الجهة: ${values.name.trim()}`,
      `نوع المشروع: ${values.service}`,
      `التفاصيل: ${values.message.trim()}`,
    ].join("\n");

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setSubmitted(true);
  };

  const fieldClass = (hasError?: string) =>
    cn(
      "w-full rounded-xl border bg-void/60 px-4 py-3.5 text-sm text-sand outline-none transition-colors duration-300",
      "placeholder:text-smoke focus-visible:border-gold",
      hasError ? "border-spectrum-3/70" : "border-white/12 hover:border-white/25",
    );

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="hairline mx-auto w-full max-w-2xl rounded-2xl bg-carbon/70 p-6 text-right backdrop-blur-sm sm:p-8"
      aria-labelledby={`${id}-legend`}
    >
      <p
        id={`${id}-legend`}
        className="text-xs font-bold tracking-[0.28em] text-gold"
      >
        اطلب عرض سعر
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label
            htmlFor={`${id}-name`}
            className="mb-2 block text-xs text-mist"
          >
            الاسم الكامل أو اسم الجهة{" "}
            <span className="text-gold" aria-hidden>
              *
            </span>
          </label>
          <input
            id={`${id}-name`}
            name="name"
            type="text"
            required
            autoComplete="organization"
            value={values.name}
            onChange={(e) => update("name")(e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? `${id}-name-error` : undefined}
            className={fieldClass(errors.name)}
            placeholder="مثال: شركة ..."
          />
          {errors.name ? (
            <p
              id={`${id}-name-error`}
              className="mt-2 text-xs text-spectrum-3"
            >
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className="sm:col-span-1">
          <label
            htmlFor={`${id}-service`}
            className="mb-2 block text-xs text-mist"
          >
            نوع المشروع{" "}
            <span className="text-gold" aria-hidden>
              *
            </span>
          </label>
          <select
            id={`${id}-service`}
            name="service"
            required
            value={values.service}
            onChange={(e) => update("service")(e.target.value)}
            aria-invalid={!!errors.service}
            aria-describedby={errors.service ? `${id}-service-error` : undefined}
            className={cn(fieldClass(errors.service), "appearance-none")}
          >
            <option value="">اختر الخدمة المطلوبة</option>
            {REQUEST_SERVICES.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
          {errors.service ? (
            <p
              id={`${id}-service-error`}
              className="mt-2 text-xs text-spectrum-3"
            >
              {errors.service}
            </p>
          ) : null}
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor={`${id}-message`}
            className="mb-2 block text-xs text-mist"
          >
            تفاصيل المشروع{" "}
            <span className="text-gold" aria-hidden>
              *
            </span>
          </label>
          <textarea
            id={`${id}-message`}
            name="message"
            required
            rows={4}
            value={values.message}
            onChange={(e) => update("message")(e.target.value)}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? `${id}-message-error` : undefined}
            className={cn(fieldClass(errors.message), "resize-y")}
            placeholder="الموقع، نطاق العمل، الجدول الزمني المتوقع..."
          />
          {errors.message ? (
            <p
              id={`${id}-message-error`}
              className="mt-2 text-xs text-spectrum-3"
            >
              {errors.message}
            </p>
          ) : null}
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 w-full rounded-full bg-gold px-8 py-4 text-sm font-bold text-void transition-colors duration-300 hover:bg-gold-light"
      >
        إرسال الطلب عبر واتساب
      </button>

      <p className="mt-4 text-center text-[0.7rem] leading-relaxed text-smoke">
        سيفتح الطلب في واتساب لتتمكن من مراجعته قبل الإرسال. لا يتم تخزين أي
        بيانات على الموقع.
      </p>

      <p role="status" aria-live="polite" className="sr-only">
        {submitted ? "تم تجهيز الطلب وفتحه في واتساب." : ""}
      </p>
    </form>
  );
}
