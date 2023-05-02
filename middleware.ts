import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default withAuth(
  function middleware(req: NextRequest) { 
    return NextResponse.rewrite(new URL(req.url));
  },
  {
    callbacks: {
      authorized({ token }) { 
        return token?.role === "admin";
      },
    }    
  }
);

export const config = { matcher: [
  "/dashboard", 
  "/api/seed",
  "/api/system_info",
  "/api/update_automatic_update_status",
  "/api/reboot",
  "/api/subdomain/create",
  "/api/subdomain/delete",
  "/api/subdomain/create_crontab",
  "/api/subdomain/create_database",
  "/api/subdomain/create_nginx_config",
  "/api/subdomain/install_application",
  "/api/subdomain/setup_application",
  "/api/subdomain/setup_ssl",
] };