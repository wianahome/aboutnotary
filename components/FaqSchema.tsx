import {
  buildFaqPageSchemaFromHtml,
  serializeFaqPageSchema,
} from "@/lib/faq-schema";

interface FaqSchemaProps {
  content: string;
}

export default function FaqSchema({ content }: FaqSchemaProps) {
  const schema = buildFaqPageSchemaFromHtml(content);

  if (!schema) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeFaqPageSchema(schema) }}
    />
  );
}
