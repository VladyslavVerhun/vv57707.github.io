<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260622165000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create book table for the custom Book CRUD model';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE book (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title VARCHAR(160) NOT NULL, author VARCHAR(120) NOT NULL, published_year INTEGER NOT NULL, genre VARCHAR(80) NOT NULL)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE book');
    }
}
