import { categories } from "@/data/categories";
import { doctors, type Doctor } from "@/data/doctors";
import { services, type Service } from "@/data/services";

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

export function getDoctorBySlug(slug: string): Doctor | undefined {
  return doctors.find((doctor) => doctor.slug === slug);
}

export function getCategoryLabel(id: string): string {
  return categories.find((category) => category.id === id)?.label ?? "";
}

/** Doctors who belong on a specialty page. Telehealth and Lab are cross-cutting. */
export function doctorsForService(service: Service): Doctor[] {
  if (service.slug === "telehealth") return doctors.filter((doctor) => doctor.telehealth);
  if (service.slug === "diagnostics-lab") return doctors.filter((doctor) => doctor.category === "wellness");
  return doctors.filter((doctor) => doctor.serviceSlug === service.slug);
}

/** Other specialties in the same department. */
export function relatedServices(service: Service, limit = 4): Service[] {
  return services
    .filter((other) => other.category === service.category && other.slug !== service.slug)
    .slice(0, limit);
}

/** Case-insensitive match against a service's title and description. */
export function serviceMatchesQuery(service: Service, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return `${service.title} ${service.description}`.toLowerCase().includes(needle);
}
