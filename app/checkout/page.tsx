'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCheckoutStore } from '@/lib/checkout-store';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { ArrowLeft, Check, ChevronLeft, ChevronRight } from 'lucide-react';

import Step1 from './steps/step-1';
import Step2 from './steps/step-2';
import Step3 from './steps/step-3';
import Step4 from './steps/step-4';
import Step5 from './steps/step-5';

const STEPS = [
  { number: 1, title: '选择产品' },
  { number: 2, title: '选择风格' },
  { number: 3, title: '填写需求' },
  { number: 4, title: '上传素材' },
  { number: 5, title: '确认订单' },
];

export default function CheckoutPage() {
  const {
    currentStep,
    nextStep,
    previousStep,
    selectedProductId,
    selectedStyleId,
    requirements,
    designSize,
    fileFormat,
    customerEmail,
    customerName,
    getTotalPrice,
    reset,
  } = useCheckoutStore();

  // Validation logic
  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return !!selectedProductId;
      case 2:
        return !!selectedStyleId;
      case 3:
        return requirements.length >= 20 && !!designSize && !!fileFormat;
      case 4:
        return true; // Upload is optional
      case 5:
        return !!customerEmail && !!customerName;
      default:
        return false;
    }
  };

  const handleConfirmOrder = async () => {
    if (!canProceedToNext()) return;

    // Here you would normally send the order to the backend
    alert('订单已提交！感谢你的订单。');
    reset();
    window.location.href = '/';
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between mx-auto px-4">
          <Link href="/">
            <div className="font-bold text-lg hover:opacity-80 transition-opacity">
              🎨 Design Platform
            </div>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              返回首页
            </Button>
          </Link>
        </motion.div>

        {/* Step Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">下单</h1>
            <span className="text-sm text-muted-foreground">
              第 {currentStep} / 5 步
            </span>
          </div>

          {/* Progress Line and Dots */}
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.number} className="flex-1 flex items-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all cursor-pointer ${
                    step.number <= currentStep
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                  onClick={() => step.number < currentStep}
                >
                  {step.number < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.number
                  )}
                </motion.div>

                {/* Progress Line */}
                {index < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all ${
                      step.number < currentStep ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Labels */}
          <div className="flex justify-between mt-2 text-xs">
            {STEPS.map((step) => (
              <div key={step.number} className="text-center flex-1">
                <p className={step.number <= currentStep ? 'text-foreground' : 'text-muted-foreground'}>
                  {step.title}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="bg-background rounded-lg border border-border p-8 mb-8 shadow-sm"
        >
          {currentStep === 1 && <Step1 />}
          {currentStep === 2 && <Step2 />}
          {currentStep === 3 && <Step3 />}
          {currentStep === 4 && <Step4 />}
          {currentStep === 5 && <Step5 />}
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center justify-between gap-4 bg-background rounded-lg border border-border p-6 shadow-sm"
        >
          <div className="text-sm text-muted-foreground">
            {currentStep > 1 && (
              <p>
                当前总费用: <span className="text-lg font-bold text-primary">${getTotalPrice()}</span>
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={previousStep}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              上一步
            </Button>

            {currentStep < 5 ? (
              <Button
                onClick={nextStep}
                disabled={!canProceedToNext()}
                className="gap-2"
              >
                下一步
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleConfirmOrder}
                disabled={!canProceedToNext()}
                className="gap-2 bg-green-600 hover:bg-green-700"
              >
                确认订单
                <Check className="w-4 h-4" />
              </Button>
            )}
          </div>
        </motion.div>

        {/* Validation Message */}
        {!canProceedToNext() && currentStep < 5 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/50 rounded-lg text-sm text-yellow-800 dark:text-yellow-200"
          >
            请完成当前步骤的所有必填项后再继续
          </motion.div>
        )}
      </div>
    </main>
  );
}
