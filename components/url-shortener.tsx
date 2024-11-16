'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { urlSchema, type UrlInput } from '@/lib/validations';

export function UrlShortener() {
  const [shortUrl, setShortUrl] = useState<string>('');

  const form = useForm<UrlInput>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: '',
    },
  });

  async function onSubmit(data: UrlInput) {
    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('生成短链接失败');
      }

      const result = await response.json();
      setShortUrl(result.shortUrl);
    } catch (error) {
      console.error('错误:', error);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-lg font-medium mb-4">输入需要缩短的URL</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="url"
            render={({ field: { ref, ...field } }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="https://example.com"
                    className="w-full"
                    {...field}
                    ref={ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            生成短链接
          </Button>
        </form>
      </Form>

      {shortUrl && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700">你的短链接:</p>
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {shortUrl}
          </a>
        </div>
      )}
    </div>
  );
}
