import React from 'react';
import { motion } from 'framer-motion';
import { Atom, Beaker, Dna, BookText, Lightbulb } from 'lucide-react';

const subjects = [
  {
    name: "Physics",
    icon: Atom,
    color: "from-blue-500 to-cyan-500",
    mcqs: "10,000+",
    chapters: "15"
  },
  {
    name: "Chemistry",
    icon: Beaker,
    color: "from-green-500 to-emerald-500",
    mcqs: "12,000+",
    chapters: "15"
  },
  {
    name: "Biology",
    icon: Dna,
    color: "from-pink-500 to-rose-500",
    mcqs: "15,000+",
    chapters: "15"
  },
  {
    name: "English",
    icon: BookText,
    color: "from-purple-500 to-violet-500",
    mcqs: "8,000+",
    chapters: "12"
  },
  {
    name: "Logical Reasoning",
    icon: Lightbulb,
    color: "from-amber-500 to-orange-500",
    mcqs: "5,000+",
    chapters: "10"
  }
];

export default function SubjectsSection() {
  return (
    <section className="py-20 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            All MDCAT Subjects Covered
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Complete coverage of all five subjects with board-specific content from KPK, Federal, and Punjab
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              className="group perspective-1000"
            >
              <div className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-center overflow-hidden transition-all duration-300 hover:border-white/20">
                {/* Animated Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${subject.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                {/* Icon Container */}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${subject.color} mb-4 shadow-lg`}
                >
                  <subject.icon className="w-8 h-8 text-white" />
                </motion.div>

                <h3 className="text-lg font-semibold text-white mb-3">{subject.name}</h3>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">MCQs</span>
                    <span className="text-white font-medium">{subject.mcqs}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Chapters</span>
                    <span className="text-white font-medium">{subject.chapters}</span>
                  </div>
                </div>

                {/* Glow Effect */}
                <div className={`absolute -bottom-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-gradient-to-br ${subject.color} rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-300`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Boards */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-wrap justify-center gap-4"
        >
          {["KPK Board", "Federal Board", "Punjab Board"].map((board, i) => (
            <div
              key={board}
              className="px-6 py-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-gray-300"
            >
              {board}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
