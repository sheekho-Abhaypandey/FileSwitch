import React from 'react';

const About = () => {
  return (
    <section className="relative py-16 px-6 sm:px-10 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-10 text-green-600 dark:text-green-400">
          About <span className="text-gray-900 dark:text-white">FileToFile</span>
        </h1>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 sm:p-10 space-y-6">
          <p className="text-lg leading-relaxed">
            <strong className="text-green-600 dark:text-green-400">FileToFile</strong> is a modern and intuitive web application built to help users convert documents between formats like <strong>DOCX</strong>, <strong>PDF</strong>, <strong>PNG</strong>, and <strong>JPG</strong>. Whether you're working on a report, presentation, or image-based content, WordToPDF makes conversions effortless.
          </p>

          <p className="text-lg leading-relaxed">
            Developed using a robust tech stack — <span className="font-semibold">React</span>, <span className="font-semibold">Node.js</span>, <span className="font-semibold">Express</span>, and <span className="font-semibold">Tailwind CSS</span> — this tool is optimized for performance, scalability, and a responsive user experience across devices.
          </p>

          <p className="text-lg leading-relaxed">
            Our mission is to provide a seamless, secure, and free platform for file conversions. With no installations required and a minimal UI, WordToPDF is perfect for students, professionals, and anyone looking for fast, high-quality results.
          </p>

          <p className="text-lg leading-relaxed">
            We are committed to continuous improvement. New formats and features are on the way — so stay connected!
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;