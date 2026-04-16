import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { leadershipTeam } from "../data/company.data";

export function LeadershipSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Meet the Leaders Driving Your Digital Transformation
          </h2>
          <p className="text-muted-foreground">
            At DQ, our leadership team brings deep expertise and a passion for empowering businesses to succeed in the digital era.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {leadershipTeam.map((leader) => {
            const initials = leader.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
            return (
              <Card key={leader.name}>
                <CardContent className="p-6 text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={leader.image} alt={leader.name} />
                    <AvatarFallback className="text-xl font-semibold">{initials}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{leader.name}</h3>
                  <p className="text-sm text-muted-foreground font-medium">{leader.role}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
