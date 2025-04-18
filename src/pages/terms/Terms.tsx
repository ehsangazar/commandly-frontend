import { FiFileText } from "react-icons/fi";

const Terms = () => {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <div className="rounded-lg border border-[var(--commandly-border)] bg-[var(--commandly-background)] p-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-full bg-[var(--commandly-primary)] p-3">
              <FiFileText className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-[var(--commandly-text-primary)]">
              Terms and Conditions
            </h1>
          </div>

          <div className="space-y-8">
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-[var(--commandly-text-primary)]">
                Agreement to Terms
              </h2>
              <p className="text-[var(--commandly-text-secondary)]">
                By accessing or using Commandly, you agree to be bound by these
                Terms and Conditions. If you disagree with any part of the
                terms, you may not access the service.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-[var(--commandly-text-primary)]">
                Use License
              </h2>
              <p className="text-[var(--commandly-text-secondary)]">
                Permission is granted to temporarily use Commandly for personal,
                non-commercial transitory viewing only. This is the grant of a
                license, not a transfer of title, and under this license you may
                not:
              </p>
              <ul className="list-inside list-disc space-y-2 pl-4 text-[var(--commandly-text-secondary)]">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Transfer the materials to another person</li>
                <li>Attempt to decompile or reverse engineer any software</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-[var(--commandly-text-primary)]">
                User Account
              </h2>
              <p className="text-[var(--commandly-text-secondary)]">
                You are responsible for maintaining the confidentiality of your
                account and password. You agree to accept responsibility for all
                activities that occur under your account.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-[var(--commandly-text-primary)]">
                Service Modifications
              </h2>
              <p className="text-[var(--commandly-text-secondary)]">
                We reserve the right to withdraw or amend our service, and any
                service or material we provide, in our sole discretion without
                notice. We will not be liable if for any reason all or any part
                of the service is unavailable at any time or for any period.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-[var(--commandly-text-primary)]">
                Limitation of Liability
              </h2>
              <p className="text-[var(--commandly-text-secondary)]">
                In no event shall Commandly or its suppliers be liable for any
                damages arising out of the use or inability to use the materials
                on our service, even if we have been notified orally or in
                writing of the possibility of such damage.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-[var(--commandly-text-primary)]">
                Contact Information
              </h2>
              <p className="text-[var(--commandly-text-secondary)]">
                If you have any questions about these Terms, please contact us
                at{" "}
                <a
                  href="mailto:legal@commandly.app"
                  className="text-[var(--commandly-primary)] hover:underline"
                >
                  legal@commandly.app
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
