import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">
            {i18n.language === 'zh' ? t('lang.chinese') : t('lang.english')}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => changeLanguage('en')}
          className={i18n.language === 'en' ? 'bg-accent' : ''}
        >
          {t('lang.english')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => changeLanguage('zh')}
          className={i18n.language === 'zh' ? 'bg-accent' : ''}
        >
          {t('lang.chinese')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
