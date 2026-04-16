"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { HomeIcon, CheckCircle, ChevronDown, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { RequestServiceModal } from "./RequestServiceModal";
import type { ServiceItem } from "../data/service.data";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "delivery-approach", label: "Delivery Approach" },
  { id: "deliverables", label: "Deliverables" },
  { id: "required-inputs", label: "Required Inputs" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function ServiceDetailPage({
  service,
}: Readonly<{ service: ServiceItem }>) {
  return (
    <Suspense>
      <ServiceDetailInner service={service} />
    </Suspense>
  );
}

const RequestBtn = ({
  size = "default",
  onClick,
}: {
  size?: "default" | "lg";
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-2 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/80 transition-colors ${size === "lg" ? "px-8 py-3 text-lg" : "px-6 py-3"}`}
  >
    Request Service <ArrowRight size={size === "lg" ? 20 : 18} />
  </button>
);

function ServiceDetailInner({ service }: Readonly<{ service: ServiceItem }>) {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [modalOpen, setModalOpen] = useState(
    () => searchParams.get("action") === "true",
  );
  const [selectedDeliverable, setSelectedDeliverable] = useState(0);

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <main className="grow">
        {/* Breadcrumb bar */}
        <div className="bg-background border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    render={<Link href="/" />}
                    className="flex items-center gap-1"
                  >
                    <HomeIcon size={16} />
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    render={<Link href="/services/marketplace" />}
                  >
                    Services
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="truncate max-w-50">
                    {service.title}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        <div className="py-8">
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="bg-muted rounded-lg shadow-sm p-8 mb-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Badge variant="secondary" className="mb-4">
                    {service.category}
                  </Badge>
                  <h1 className="text-3xl font-bold text-foreground mb-4">
                    {service.title}
                  </h1>
                  <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <RequestBtn onClick={() => setModalOpen(true)} />
                </div>
                <div className="lg:col-span-1">
                  <Card className="py-0 gap-0">
                    <CardContent className="p-6">
                      {[
                        { label: "Category:", value: service.serviceCategory },
                        { label: "Type:", value: "Design" },
                        { label: "Duration:", value: service.duration },
                        {
                          label: "Availability:",
                          value: service.serviceAvailability,
                          accent: true,
                        },
                        { label: "Provided by:", value: service.provider },
                      ].map(({ label, value, accent }, i, arr) => (
                        <div key={label}>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-muted-foreground font-medium text-sm">{label}</span>
                            <span
                              className={`font-semibold text-sm ${accent ? "text-accent" : "text-foreground"}`}
                            >
                              {value}
                            </span>
                          </div>
                          {i < arr.length - 1 && <Separator />}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Card className="py-0 gap-0">
              <div className="border-b border-border">
                <nav className="flex space-x-8 px-8">
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? "border-secondary text-secondary"
                          : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <CardContent className="p-8">
                {/* Overview */}
                {activeTab === "overview" && (
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-6">
                      Service Overview
                    </h2>
                    {service.overview.paragraphs.map((p) => (
                      <p key={p} className="text-muted-foreground mb-6">
                        {p}
                      </p>
                    ))}
                    <div className="space-y-3 mb-8">
                      {service.overview.keyAreas.map((area) => (
                        <div key={area} className="flex items-center gap-3">
                          <CheckCircle
                            size={20}
                            className="text-accent shrink-0"
                          />
                          <span className="text-foreground">{area}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-secondary/10 border-l-4 border-secondary p-6 rounded-r-lg">
                      <h3 className="text-lg font-semibold text-foreground mb-4">
                        Who This Service Is For
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Best suited for organisations that:
                      </p>
                      <div className="space-y-2">
                        {service.overview.targetAudience.map((item) => (
                          <div key={item} className="flex items-start gap-3">
                            <CheckCircle
                              size={16}
                              className="text-secondary shrink-0 mt-0.5"
                            />
                            <span className="text-muted-foreground">
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Delivery Approach */}
                {activeTab === "delivery-approach" && (
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-6">
                      How the Service Is Delivered
                    </h2>
                    <p className="text-muted-foreground mb-8">
                      The service follows a four-stage design lifecycle, with
                      each stage building toward implementation readiness.
                    </p>
                    <div className="space-y-4">
                      {service.deliveryStages.map((stage) => (
                        <Collapsible key={stage.number}>
                          <div className="border border-border rounded-lg overflow-hidden">
                            <CollapsibleTrigger className="w-full bg-secondary/10 p-4 hover:bg-secondary/20 transition-colors group">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                                    {stage.number}
                                  </div>
                                  <div className="text-left">
                                    <p className="font-bold text-foreground">
                                      {stage.title}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {stage.subtitle}
                                    </p>
                                  </div>
                                </div>
                                <ChevronDown
                                  size={20}
                                  className="text-muted-foreground transition-transform group-data-[state=open]:rotate-180"
                                />
                              </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="p-6 space-y-4">
                                <div>
                                  <p className="font-semibold text-foreground mb-1 text-sm uppercase tracking-wide">
                                    Outcome
                                  </p>
                                  <p className="text-muted-foreground">
                                    {stage.outcome}
                                  </p>
                                </div>
                                <div>
                                  <p className="font-semibold text-muted-foreground mb-2 text-sm uppercase tracking-wide">
                                    What&apos;s Achieved
                                  </p>
                                  <div className="space-y-2">
                                    {stage.achieved.map((item) => (
                                      <div
                                        key={item}
                                        className="flex items-start gap-2"
                                      >
                                        <CheckCircle
                                          size={16}
                                          className="text-accent shrink-0 mt-0.5"
                                        />
                                        <span className="text-muted-foreground text-sm">
                                          {item}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <p className="font-semibold text-muted-foreground mb-2 text-sm uppercase tracking-wide">
                                    Primary Deliverables
                                  </p>
                                  <ul className="space-y-1">
                                    {stage.deliverables.map((d) => (
                                      <li
                                        key={d}
                                        className="text-sm text-muted-foreground"
                                      >
                                        • {d}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </CollapsibleContent>
                          </div>
                        </Collapsible>
                      ))}
                    </div>
                  </div>
                )}

                {/* Deliverables */}
                {activeTab === "deliverables" && (
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-6">
                      What You Receive
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                      <div className="space-y-4">
                        {service.deliverables.map((d, i) => (
                          <button
                            key={d.title}
                            onClick={() => setSelectedDeliverable(i)}
                            className={`w-full text-left rounded-lg p-4 transition-all border-2 ${
                              selectedDeliverable === i
                                ? "border-secondary bg-secondary/10"
                                : "border-border bg-background hover:border-secondary/50"
                            }`}
                          >
                            <h3 className="font-bold text-foreground mb-2">
                              {d.title}
                            </h3>
                            <p className="text-muted-foreground text-sm">
                              {d.description}
                            </p>
                          </button>
                        ))}
                      </div>
                      <div className="bg-muted rounded-lg p-6 flex flex-col items-center justify-center min-h-75">
                        <h4 className="font-semibold text-foreground mb-2 text-center">
                          {service.deliverables[selectedDeliverable]?.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-4 text-center">
                          {
                            service.deliverables[selectedDeliverable]
                              ?.description
                          }
                        </p>
                        <Card className="w-full py-0 gap-0">
                          <CardContent className="p-8 text-center">
                            <p className="text-muted-foreground text-sm">
                              Visual preview coming soon
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    <div className="border-2 border-secondary/30 rounded-lg p-8 text-center bg-background">
                      <h3 className="text-2xl font-bold text-foreground mb-4">
                        Ready to Design Your Digital Practice?
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Get implementation-ready specifications and validated
                        prototypes that enable confident investment.
                      </p>
                      <RequestBtn
                        size="lg"
                        onClick={() => setModalOpen(true)}
                      />
                    </div>
                  </div>
                )}

                {/* Required Inputs */}
                {activeTab === "required-inputs" && (
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-6">
                      What We Need From You
                    </h2>
                    <p className="text-muted-foreground mb-8 text-lg">
                      To deliver a tailored {service.title}, we require the
                      following materials from your organisation before
                      commencement:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      {service.requiredInputs.map((group) => (
                        <Card key={group.category} className="py-0 gap-0">
                          <CardContent className="p-6">
                            <h3 className="font-bold text-foreground mb-4">
                              {group.category}
                            </h3>
                            <div className="space-y-3">
                              {group.items.map((item) => (
                                <div
                                  key={item}
                                  className="flex items-center gap-3"
                                >
                                  <div className="w-5 h-5 border-2 border-secondary rounded-full flex items-center justify-center shrink-0">
                                    <div className="w-2 h-2 bg-secondary rounded-full" />
                                  </div>
                                  <span className="text-muted-foreground text-sm">
                                    {item}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <div className="bg-accent/10 border-l-4 border-accent p-4 mb-8 rounded-r-lg">
                      <p className="text-sm text-foreground">
                        <strong>Note:</strong> All required input materials must
                        be provided before commencement. Incomplete inputs may
                        delay delivery or reduce the quality of strategic
                        recommendations.
                      </p>
                    </div>
                    <div className="border-2 border-secondary/30 rounded-lg p-8 text-center bg-background">
                      <h3 className="text-2xl font-bold text-foreground mb-4">
                        Ready to get started?
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Get implementation-ready specifications and validated
                        prototypes that enable confident investment.
                      </p>
                      <RequestBtn
                        size="lg"
                        onClick={() => setModalOpen(true)}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <RequestServiceModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        serviceTitle={service.title}
      />
    </div>
  );
}
